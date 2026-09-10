# FORGE README System

FORGE does not treat a project README as an afterthought. The README is part of the product presentation, documentation, and public interface of a repository.

This folder contains reusable README patterns that FORGE can select and populate from project context.

## Principles

- Explain the product before explaining the code.
- Make the README visually communicate the product when visual material is useful.
- Prefer real screenshots, demos, diagrams, or animations over decorative filler.
- Use a strong opening identity, concise value proposition, clear actions, and an evidence-driven feature section.
- Include architecture and project structure when they help a technical reader understand the system.
- Show setup and usage accurately. Never invent commands, features, links, or assets.
- Keep the document specific to the product rather than forcing a generic section list.
- Validate every image, link, badge, code block, and embedded asset before completion.
- Respect GitHub Markdown rendering constraints.

## Selection

Choose the smallest template that can represent the project well:

- `PRODUCT.md` for applications, platforms, and user-facing products.
- `LIBRARY.md` for reusable packages and developer libraries.
- `TOOL.md` for developer tools, CLIs, infrastructure utilities, and technical projects.

FORGE may combine sections between templates when the project genuinely needs them.

## Visual standard

A strong README may use centered hero sections, badges, visual demonstrations, tables, diagrams, collapsible details, screenshots, animated Graphics Interchange Format (GIF) media, or Scalable Vector Graphics (SVG) artwork. These are used to communicate the product, not merely to make the page busy.

The visual-documentary approach used in projects such as THE BLACK CROWN is a reference pattern: real product behavior can be presented as a sequence of scenes, supported by architecture, feature, design-doctrine, roadmap, and status sections.

## Generation rule

The project-specific README is generated from verified project context. The AI should inspect the real repository, available assets, deployed behavior, architecture, and current state before writing claims.
