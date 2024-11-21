import type { Plugin } from 'vue'

export type MapBoxBoxObject = {
  lat: { min: number; max: number }
  lng: { min: number; max: number }
}

export type MapBoxInstance = {
  calculateBoundingBox(
    lat: number,
    lng: number,
    radius: number,
  ): MapBoxBoxObject
}

// Semi-axes of WGS-84 geoidal reference
const WGS84_a = 6378137.0 // Major semiaxis [m]
const WGS84_b = 6356752.3 // Minor semiaxis [m]

// Earth radius at a given latitude, according to the WGS-84 ellipsoid [m]
function WGS84EarthRadius(lat: number) {
  // http://en.wikipedia.org/wiki/Earth_radius
  var An = WGS84_a * WGS84_a * Math.cos(lat)
  var Bn = WGS84_b * WGS84_b * Math.sin(lat)
  var Ad = WGS84_a * Math.cos(lat)
  var Bd = WGS84_b * Math.sin(lat)
  return Math.sqrt((An * An + Bn * Bn) / (Ad * Ad + Bd * Bd))
}

function degToRad(degrees: number) {
  return degrees * (Math.PI / 180)
}
function radToDeg(rad: number) {
  return (180 * rad) / Math.PI
}

export function BoxFactory(): MapBoxInstance {
  /**
   *
   * @param lat : lat float
   * @param lng : lng float
   * @param halfSideInKm : radis distance in KM
   * @returns
   */
  function calculateBoundingBox(
    lat: number,
    lng: number,
    halfSideInKm: number,
  ) {
    // Bounding box surrounding the point at given coordinates,
    // assuming local approximation of Earth surface as a sphere
    // of radius given by WGS84
    const latRad = degToRad(lat)
    const lngRad = degToRad(lng)
    const halfSide = 1000 * halfSideInKm

    // Radius of Earth at given latitude
    const radius = WGS84EarthRadius(latRad)
    // Radius of the parallel at given latitude
    const pradius = radius * Math.cos(latRad)

    const latMin = latRad - halfSide / radius
    const latMax = latRad + halfSide / radius
    const lngMin = lngRad - halfSide / pradius
    const lngMax = lngRad + halfSide / pradius
    return {
      lat: {
        min: radToDeg(latMin),
        max: radToDeg(latMax),
      },
      lng: {
        min: radToDeg(lngMin),
        max: radToDeg(lngMax),
      },
    }
  }

  return {
    calculateBoundingBox,
  }
}

export const MapBoxPlugin: Plugin = {
  install(app) {
    app.provide('mapBox', BoxFactory())
  },
}
