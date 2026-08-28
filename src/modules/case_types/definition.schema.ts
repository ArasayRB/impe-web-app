// src/modules/case_types/definition/schema.ts

import type {DefinitionSection} from "@/lib/definitions/types";
import { slugToKey } from "@/lib/utils/slugToKey";

export const caseTypeDefinitionSchema: DefinitionSection[] = [

    {

        key: "analytics",

        title: "Analytics",
		
    	order:10,

    	defaultOpen:true,

        fields: [

            {

                key: "expected_duration_days",

                label: "Expected duration (days)",

                type: "number",

                default: 0

            },

            {

                key: "alert_after_days",

                label: "Alert after (days)",

                type: "number",

                default: 0

            },

            {

                key: "track_signatures",

                label: "Track signatures",

                type: "switch",

                default: false

            },

            {

                key: "signature_interval_days",

                label: "Signature interval (days)",

                type: "number",

                default: 10

            }

        ]

    },
    {

        key:"statuses",

        title: "Statuses",

				order:20,

        fields:[

						{

								key:"items",

								type:"collection",

								schema:[
										{
											key: "order",
											type: "number",
											default:0,
											hidden:true
										},

										{

											key:"label",

											type:"text"

										},

										{

											key:"key",

											type:"text",
											
											autoGenerateFrom:"label",
					
											transform:(value)=>slugToKey(value)

										},

										{

											key:"color",

											type:"color",

											default:"#3b82f6"

										},

										{

											key:"client_visible",

											type:"switch",

											default:true

										},

										{

											key:"final",

											type:"switch",

											default:false

										}

								]

						}

				]

    },
		{

			key:"workflow",

			title:"Workflow",
			
			order:30,

			fields:[

				{

					key:"steps",

					type:"collection",

					schema:[

						{

							key:"label",

							type:"text"

						},

						{

							key:"key",

							type:"text",
							
								autoGenerateFrom:"label",

							transform:(value)=>slugToKey(value)

						},

						{

							key:"starts_on",

							type:"select",

							resolver(definition){

								return (

									definition

										?.statuses

										?.config

										?.items

										?? []

								).sort((a,b)=>(a.order ?? 0) - (b.order ?? 0))
								.map(status=>({

									value:status.key,

									label:status.label

								}));

							}

						},

						{

							key:"ends_on",

							type:"multiselect",

							resolver(definition){

								return (

									definition

										?.statuses

										?.config

										?.items

										?? []

								).sort((a,b)=>(a.order ?? 0) - (b.order ?? 0))
								.map(status=>({

									value:status.key,

									label:status.label

								}));

							}

						},

						{

							key:"expected_duration_days",

							type:"number",

							default:0

						}

					]

				}

			]

		},
		{
				key: "documents",

				title: "Documents",

				order: 40,

				fields: [

						{
								key: "required",

								type: "collection",

								schema: [
										{
												key: "label",
												type: "text"
										},
										{
												key: "key",
												type: "text",
												autoGenerateFrom:"label",
												transform:(value)=>slugToKey(value)
										},
										{
												key: "required",
												type: "switch",
												default: false
										},
										{
												key: "required_to_finish",
												type: "switch",
												default: false
										},
										{
												key: "multiple",
												type: "switch",
												default: false
										},
										{
												key: "min_files",
												type: "number",
												default: 0
										},
										{
												key: "max_files",
												type: "number",
												default: 1
										},
										{
											key: "accepted_types",
											type: "multiselect",
											options: [
													{ value: "pdf", label: "PDF" },
													{ value: "jpg", label: "JPG" },
													{ value: "jpeg", label: "JPEG" },
													{ value: "png", label: "PNG" },
													{ value: "doc", label: "DOC" },
													{ value: "docx", label: "DOCX" }
											]
									}
								]
						}

				]
		},
		{
				key: "data",
				title: "Data",
				order: 50,
				fields: [
						{
								key: "fields",
								type: "collection",
								schema: [
										{
												key: "label",
												type: "text"
										},
										{
												key: "key",
												type: "text",
												autoGenerateFrom:"label",
												transform:(value)=>slugToKey(value)
										},
										{
												key: "type",
												type: "select",
												options: [
														{
																value: "string",
																label: "String"
														},
														{
																value: "number",
																label: "Number"
														}
												]
										},
										{
												key: "required",
												type: "switch",
												default: false
										}
								]
						}
				]
		},
		{
				key: "email",

				title: "Email",

				order: 60,

				fields: [

						{
								key: "allowed_sender_domains",

								type: "string-list",

								default: []
						}

				]

		}

];
