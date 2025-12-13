# Admin Dashboard – Astro + Flowbite

Dashboard administrativo en desarrollo, basado en **Astro**, **Tailwind CSS** y **Flowbite**, orientado a aplicaciones internas con autenticación, layouts reutilizables y control de acceso por rutas.

> Este proyecto parte de un template open-source, pero ha sido adaptado y extendido para cubrir necesidades específicas de negocio.

---

## 🧩 Características principales

- Layout principal con sidebar (Flowbite)
- Sistema de layouts reutilizables (`LayoutSidebar`, `LayoutCommon`, etc.)
- Autenticación (login / logout)
- Route guards para proteger secciones privadas
- Estructura modular para escalar el dashboard
- Tailwind CSS + Flowbite UI components

---

## 🏗️ Estructura del proyecto (simplificada)

```txt
src/
├── app/
│   ├── LayoutSidebar.astro   # Layout principal del dashboard
│   ├── LayoutCommon.astro    # Layout base compartido
│   ├── LayoutPublic.astro    # Layout que incluye BaseLayout y Common (blogs, públicos)
│   └── guards/
│       └── auth.guard.ts         # Protección de rutas
│
├── layouts/
│   ├── BaseLayout.astro      # Layout mínimo (blogs, públicos)
├── pages/
│   ├── dashboard/
│   ├── settings/
│   ├── blog/
│   └── authentication/
│
├── components/
└── lib/
