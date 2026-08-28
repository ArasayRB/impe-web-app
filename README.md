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
## revisar auth folder, no creo que se este usando, y si se usa hay que integrarlo a los files que ya tenemos en lib como session, redirectAfterLogin...

```txt
src/
├── app/                      # ppalmente componentes de layouts ppales y layouts
|   ├── constants.ts          # constants como Api url, remote assets, site title...
│   ├── LayoutSidebar.astro   # Layout principal del dashboard
│   ├── LayoutCommon.astro    # Layout base compartido
│   ├── LayoutPublic.astro    # Layout que incluye BaseLayout y Common (blogs, públicos)
│   └── guards/
│       └── auth.guard.ts         # Protección de rutas
│
├── assets/                     # svg(s) images in the future of site
│
├── auth/                     # svg(s) images in the future of site
│   ├── logout.client.ts      
│   ├── redirectAFterLogin.ts
│   ├── session.ts
│   ├── user.ts
│
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.astro
│   │   ├── DashboardClient.ts
│   │   ├── DashboardCards.ts
│   │   ├── DashboardTable.ts
│   │   ├── DashboardLineChart.ts
│   │   ├── DashboardBarChart.ts
│   │   ├── DashboardPieChart.ts
│   │   ├── mountDashboard.ts
│
├── content/
│   ├── blog/
│   │   ├── mi-primer-post.mdx #post default if not loggin or list post not answare
│
├── hooks/
│   ├── useAuth.ts      # hook used on LayoutSidebar
│
├── layouts/
│   ├── BaseLayout.astro      # Layout mínimo (blogs, públicos)
│
├── lib/
│   ├── analytics/
│   │   ├── analyticsEvents.ts #events
│   │   ├── cardIcons.ts #icons of cards
│   │   ├── chartsEvents.ts #Charts events
│   │   ├── chartsRegistry.ts #Charts register
│   │   ├── createAnalyticsModule.ts #analytics module
│   │   ├── createAnalyticsUi.ts #ui
│   │   ├── dom.ts #dom
│   │   ├── exportCsv.ts #export csv
│   │   ├── map.timeline.ts #timeline mapper
│   │   ├── renderAnalyticsOptions.ts #analytics options
│   │   ├── renderAnalyticsTabs.ts #analytics tabs
│   │   ├── renderBarChart.ts
│   │   ├── renderCards.ts
│   │   ├── renderDashboard.ts
│   │   ├── renderError.ts
│   │   ├── renderFilters.ts
│   │   ├── renderLineChart.ts
│   │   ├── renderPieChart.ts
│   │   ├── renderTable.ts
│   │   ├── tableController.ts #Controlador de tablas
│   │   ├── tableSortEvents.ts #Table sort events
│   │   ├── renderInsights.ts	# in the future
│   │   ├── renderActivityFeed.ts	# in the future
│   │   ├── renderSmartChat.ts	# in the future
│   │   └── types.ts
│   ├── crud/
│   │    └── components/
│   │    │    ├── crateCrudSwitch.ts/
│   │    └── forms/
│   │    │    ├── FormTabs.ts/   # has the tabs for createCrudForm
│   │    │    ├── FormSwitch.ts/
│   ├── formatters/
│   │   ├── date.ts #dates formates
│   ├── definitions/
│   │   ├── autoGenerateField.ts 
│   │   ├── createDefinitionInput.ts #General Inputs definition
│   │   ├── DefinitionColor.ts 
│   │   ├── DefinitionRegistry.ts 
│   │   ├── renderCollection.ts #General collection defined
│   │   ├── renderDefinition.ts #Render definition of any module which has it
│   │   ├── renderDefinitionSection.ts #Render definition section of any module which has it
│   │   ├── types.ts # expected types
│   ├── mappers/
│   │   ├── 2faerror.mapper.ts # 2fa mapper error
│   │   ├── post.mapper.ts # 2fa mapper 
│   │   ├── site.mapper.ts # 2fa mapper 
│   ├── i18n/
│   │    ├── config.ts  # contain supoprted locales with config for view and languages files names
│   │    ├── getTranslator.ts  # use it when you need an specific translate by key
│   │    ├── index.ts
│   │    ├── i18n.ts		#contain init i18n helper functions
│   │    ├── initLocale.client.ts #init lang in DOM
│   │    ├── loader.ts	# load namespace
│   │    ├── store.ts	# set locale
│   │    ├── server.ts	#resolve the lang from server tenant
│   │    ├── type.ts		# contain real Locale supported and namespaces languages
│   │    ├── resolveLocale.ts	# resolve locale
│   │    ├── resolveTranslations.ts	# resolve translation object
│   │    ├── translate.ts	#resolve translate by full key resolver name
│   │    ├── useI18n.ts	# to bind the translations after locale changes
│   │    └── locales/
│   │    │    ├── en/
│   │    │    │   ├── common.json
│   │    │    │   ├── customer.json
│   │    │    │   ├── cases.json
│   │    │    │   ├── auth.json
│   │    │    │   ├── casetypes.json
│   │    │    │   ├── navbar.json
│   │    │    │   └── sidebar.json
│   │    │    ├── es/
│   │    │    │   ├── common.json
│   │    │    │   ├── customer.json
│   │    │    │   ├── cases.json 
│   │    │    │   ├── auth.json
│   │    │    │   ├── casetypes.json
│   │    │    │   ├── navbar.json
│   │    │    │   └── sidebar.json
│   ├── api.error.ts      # errors api handle
│   ├── auth.ts      # ensure valid session
│   ├── cookie.ts      # cookies handle
│   ├── createCrudForm.ts      # form crud
│   ├── createCrudModule.ts      # list crud
│   ├── createCrudUi.ts      # ui crud
│   ├── createViewEngineUi.ts      # i18n each time view changes
│   ├── crudColumn.ts      # type crud column
│   ├── data.ts      #
│   ├── debounce.ts      #debounce
│   ├── device.store.ts      #device
│   ├── env.ts      #
│   ├── error.handle.client.ts      #
│   ├── error.handle.ts      #
│   ├── event.bus.ts      #
│   ├── loader.ts      #
│   ├── logger.ts      # log register
│   ├── modal.controller.ts      # 
│   ├── modal.events.ts      # 
│   ├── modal.registry.ts      # 
│   ├── resolveCrudFields.ts      # 
│   ├── resolveDevice.ts      #
│   ├── resolveSite.ts      #
│   ├── session.ts      #
│   ├── site.store.ts      #
│   ├── site.ts      #
│   ├── toast.ts      #
│   ├── ui.autocomplete.ts      #
│   ├── ui.helpers.ts      #
│   ├── ui.interaction.ts      #
│
├── middlewares/
│   ├── auth.middleware.ts
│   └── site.middleware.ts
│
├── modules/        #forms and partial
│   ├── cases/
│   │   ├── forms/
│   │   │   ├── add.astro # create
│   │   │   ├── delete.astro # remove 
│   │   │   ├── edit.astro # edit 
│   │   ├── CaseAnalytics.astro      # crud 
│   │   ├── cases.analytics.store.ts        # estado reactivo
│   │   ├── cases.analytics.ui.ts        # to handle cases analytics ui
│   │   ├── case-search.astro      # searcher
│   │   ├── Cases.astro      # crud 
│   │   ├── cases.form.config.ts      # fields form 
│   │   ├── cases.relationships.ts      # people options relationed with case 
│   │   ├── cases.service.ts      # orquestador híbrido
│   │   ├── cases.server.ts       # SSR only 
│   │   ├── cases.client.ts       # browser only 
│   │   ├── cases.store.ts        # estado reactivo
│   │   ├── cases.types.ts        
│   │   ├── cases.ui.ts           # to handle cases ui
│   │   ├── casesAnalyticsMapper.ts        # mapper cases analytics
│   ├── case_types/
│   │   ├── forms/
│   │   │   ├── add.astro # create
│   │   │   ├── delete.astro # remove 
│   │   │   ├── edit.astro # edit 
│   │   ├── casetypes-search.astro      # searcher
│   │   ├── CaseTypes.astro      # crud 
│   │   ├── casetypes.form.config.ts      # fields form 
│   │   ├── casetypes.service.ts      # orquestador híbrido
│   │   ├── casetypes.server.ts       # SSR only 
│   │   ├── casetypes.client.ts       # browser only 
│   │   ├── casetypes.store.ts        # estado reactivo
│   │   ├── casetypes.helpers.ts      # helper to map statuses
│   │   ├── casetypes.status.mapper.ts      # mapper statuses
│   │   ├── casetypes.types.ts        
│   │   ├── casetypes.ui.ts           # to handle case types ui
│   │   ├── definition.schema.ts      # define default schema
│   ├── customers/
│   │   ├── forms/
│   │   │   ├── add.astro # create
│   │   │   ├── delete.astro # remove 
│   │   │   ├── edit.astro # edit 
│   │   ├── customer-search.astro      # searcher
│   │   ├── Customer.astro      # crud 
│   │   ├── CustomerAnalytics.astro      # crud 
│   │   ├── customers.analytics.ui.ts    # to handle customers analytics ui
│   │   ├── customers.analytics.store.ts  # to handle customers analytics store
│   │   ├── customers.form.config.ts      # fields form 
│   │   ├── customers.service.ts      # orquestador híbrido
│   │   ├── customers.server.ts       # SSR only 
│   │   ├── customers.client.ts       # browser only 
│   │   ├── customers.store.ts        # estado reactivo
│   │   ├── customers.types.ts        
│   │   ├── customers.ui.ts           # to handle customers ui
│   │   ├── customersAnalyticsMapper.ts         # analytics mapper customers
│   ├── document_templates/
│   │   ├── forms/
│   │   │   ├── add.astro # create
│   │   │   ├── delete.astro # remove 
│   │   │   ├── edit.astro # edit 
│   │   ├── document-templates-search.astro      # searcher
│   │   ├── DocumentTemplates.astro      # crud 
│   │   ├── document-templates.form.config.ts      # fields form 
│   │   ├── document-templates.service.ts      # orquestador híbrido
│   │   ├── document-templates.server.ts       # SSR only 
│   │   ├── document-templates.client.ts       # browser only 
│   │   ├── document-templates.store.ts        # estado reactivo
│   │   ├── document-templates.types.ts        
│   │   ├── document-templates.ui.ts        # to handle document-templates ui
│   ├── auth/
│   │   ├── auth.service.ts         # orquestador híbrido
│   │   ├── logout.client.ts     
│   │   ├── auth.client.ts          # browser only 
│   │   ├── redirectAfterLogin.ts   
│   ├── blog/
│   │   ├── posts.service.ts         # orquestador híbrido
│
│
├── pages/
│   ├── dashboard/
│   │   ├── analytics/
│   │   │   ├── cases.astro # charts summary
│   │   │   ├── customers.astro # charts summary 
│   │   ├── cases.astro         
│   │   ├── case_types.astro         
│   │   ├── customers.astro
│   ├── settings/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   ├── index.astro # blog detail
│   │   ├── index.astro     # users list blog
│   └── authentication/
│
├── services/
│   ├── api.client.ts   
│   ├── api.server.ts      # 
│   ├── api.ts      # fetch ppal
│   ├── auth.client.ts      #
│   ├── index.ts      #
│   ├── products.ts      #
│   └── users.ts      #
├── types/
│   ├── entities.ts      # 
│   └── flowbite-typography.d.ts      # fetch ppal
├── ui/
│   ├── Switch/
│   │   ├── index.ts # index
│   │   ├── Switch.ts # switch
│   ├── CasePeopleSelector/
│   │   ├── CasePeopleSelector.template.ts # template
│   │   ├── CasePeopleSelector.ts # selector
│   │   ├── CasePeopleSelector.types.ts # types
│   ├── TagSelector/
│   │   ├── index.ts # index
│   │   ├── TagSelector.styles.ts # styles
│   │   ├── TagSelector.template.ts # template
│   │   ├── TagSelector.ts # tag
│   │   ├── TagSelector.types.ts # tag
│   └── uiComponent.ts      # component
├── env.ts      #
├── middleware.ts      #
└──       #... others files

# Hide toolbar from console
astro preferences disable devToolbar
