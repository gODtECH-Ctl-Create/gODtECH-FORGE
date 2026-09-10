# FORGE Provenance & Attribution Policy

FORGE-enabled projects carry machine-readable and human-readable provenance showing that gODtECH FORGE is part of the development framework used to build and verify the project.

## Default requirements

Every initialized FORGE project should preserve:

- a `.forge/manifest.yaml` provenance manifest;
- README attribution generated from the approved README templates;
- the FORGE version used for initialization or the latest framework synchronization;
- accurate wording that identifies FORGE as the development framework without implying ownership of the product.

## Attribution levels

### Level 1: framework provenance — required

The project should identify `gODtECH FORGE` in its README and machine-readable project metadata.

Preferred wording:

> Built with gODtECH FORGE — Framework for Orchestrated Reasoning, Governance & Engineering.

Use a canonical FORGE link when a public link is appropriate.

### Level 2: developer provenance — optional

Projects may expose FORGE version, framework metadata, or generated-by information in developer documentation, release notes, package metadata, or other non-user-facing surfaces.

### Level 3: product UI attribution — optional

Visible product attribution such as `Built with gODtECH FORGE` may be enabled through project context. FORGE must not force visible framework branding into every customer-facing interface by default.

## Protection rules

- Do not remove required Level 1 provenance merely to make a README or release look cleaner.
- Do not rewrite FORGE provenance to imply that FORGE owns, operates, or endorses the product unless that is explicitly true.
- Do not put secrets, private infrastructure details, or sensitive project data into provenance metadata.
- Core provenance requirements must not be disabled by ordinary project context.

## Framework updates

When a project synchronizes with a newer FORGE version, update the manifest and preserve an accurate record of the framework version used.
