---
# Project page, served at /projects/<file name>/. Images live in assets/projects/<file name>/.
#   title, tagline (one sentence for the overview card), order (sort order on /projects/)
#   optional: cover (+ cover_alt), links (label, url, icon = Font Awesome classes),
#             gallery (file, caption, optional alt)
# The Markdown below the front matter is the description.
title: Flood Monitor & Water Depth Pipeline
tagline: From a satellite-derived flood extent to water-depth maps and impact numbers for any area of interest.
order: 1
cover: cover.jpg
cover_alt: Modelled flood water depth south of Valencia on an OpenStreetMap background
links:
  - label: GitHub
    url: https://github.com/kwundram2602/openeo_flood
    icon: fab fa-github
gallery:
  - file: data-flow.jpg
    caption: Data flow — where each step gets its data from and what it writes
  - file: water-depth.jpg
    caption: Results — FLEXTH water depth with impact indicators
  - file: population-exposure.jpg
    caption: Results — population, infrastructure and building exposure
  - file: dashboard-home.jpg
    caption: Dashboard — project overview
  - file: aoi.jpg
    caption: Dashboard — drawing the area of interest
  - file: gfm-scenes.jpg
    caption: Dashboard — browsing available GFM flood scenes
---

The app was created in the context of a university course for Advanced Cloud Computing and turns a satellite-derived flood extent into an interpolated water-depth
map and a set of impact numbers for any area of interest.
It uses the EODC STAC which hosts the Gobal Flood Monitor, Google Earth Engine together with Flexth.

## Pipeline steps

- **dem** — downloads the FABDEM terrain model for the AOI from Google Earth Engine.
- **gfm** — loads GFM flood extents from the EODC STAC catalog and aggregates them over the chosen time range.
- **osm** — fetches roads and railways via OSMnx and intersects them with the flood extent to get flooded kilometres.
- **flexth** — resamples DEM and flood mask onto a common grid and runs FLEXTH to estimate water level and depth.
- **population** — combines WorldPop with the depth raster to count affected people.
- **ghsl** — combines GHSL built-up data with the depth raster to estimate building damage
  (JRC/Huizinga depth-damage curves; order-of-magnitude estimates, not calibrated figures).

## Dashboard

The Streamlit app walks through one project from configuration to results: edit
the config per step, draw the area of interest, search the catalog for GFM scenes
that actually exist for it, run the steps with live logs, and explore the results
on a map — water depth, GFM likelihood, the GFM exclusion mask and the flood
pixels added by the FLEXTH interpolation.
