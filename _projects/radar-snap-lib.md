---
# Project page, served at /projects/<file name>/. Images live in assets/projects/<file name>/.
#   title, tagline (one sentence for the overview card), order (sort order on /projects/)
#   optional: cover (+ cover_alt), links (label, url, icon = Font Awesome classes),
#             gallery (file, caption, optional alt)
# The Markdown below the front matter is the description.
title: Radar Snap Lib
tagline: Build and run ESA SNAP processing graphs from YAML, with a typed Python builder API for the radar operators.
order: 2
links:
  - label: GitHub
    url: https://github.com/kwundram2602/radar-snap-lib
    icon: fab fa-github
---

A Python library and command line tool around ESA SNAP (`esa_snappy`) for
Sentinel-1 radar processing. A pipeline is described in YAML — one key per
operator, its parameters as subkeys — and each node takes the previous one as its
source, so a linear chain needs no wiring:

```yaml
pipeline:
  Read:
    file: ${vars.scene}
  Apply-Orbit-File:
    orbitType: Sentinel Precise (Auto Download)
  Calibration:
    outputBetaBand: true
  Terrain-Flattening:
    demName: Copernicus 30m Global DEM
  Terrain-Correction:
    pixelSpacingInMeter: 10.0
```

## What it does

- **Search and download** scenes from the ASF archive with the same YAML approach:
  AOI (GeoPackage, Shapefile, GeoJSON, bounding box or WKT), time range and any
  ASF search option.
- **Validation without a JVM**: configs are checked offline, so a typo in a
  parameter name is caught before anything runs.
- **Explicit wiring** where a straight chain is not enough, e.g. two inputs for
  interferometric coregistration.
- **Intermediates on demand**: any node can be saved as BEAM-DIMAP to open in SNAP Desktop.
- **Filters after SNAP**: edge detection and morphology (scikit-image) as pipeline nodes
  on the resulting GeoTIFFs.
- **Inspect graphs**: dump the generated GPF graph XML or render it as an image.
