// src/ui/CaseDocuments/CaseDocuments.ts
import { t } from "@/lib/i18n/i18n";
import {
    getCaseDocuments,
    uploadCaseDocument,
    generateCaseDocument,
    deleteCaseDocument
} from "@/modules/cases/cases.service";

import { confirmAction } from '@/lib/confirmAction';

import type {
    CaseDocumentsProps,
    CaseDocument
} from "./CaseDocuments.types";

export async function renderCaseDocuments({
    container,
    caseId,
    caseType,
    documentTemplates
}: CaseDocumentsProps) {

    const categories =
        caseType?.definition
            ?.documents
            ?.config
            ?.required
        ?? [];

    (container as any).__caseType = caseType;

    const response: any =
        await getCaseDocuments(caseId);

    const documents: CaseDocument[] =
        response?.data ?? [];

    container.innerHTML = `
        <div class="relative space-y-6" data-case-documents-root>
				<!-- loading mask -->
					<div
						data-case-documents-loading
						class="
								hidden
								absolute
								inset-0
								z-50
								bg-white/70
								dark:bg-gray-900/70
								backdrop-blur-[1px]
								flex
								items-center
								justify-center
						"
				>
						<div class="text-sm text-gray-600 dark:text-gray-300">
								${t('common.messages.loading')}
						</div>
				</div>

            <div>
                <h3 class="
                    text-lg
                    font-semibold
                    text-gray-900
                    dark:text-white
                ">
                    ${t('cases.documents.title')}
                </h3>

                <p class="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                ">
                    ${t('cases.documents.description')}
                </p>
            </div>


            <!-- UPLOAD -->

            <div class="
                border
                border-gray-200
                dark:border-gray-700
                rounded-lg
                p-5
            ">

                <h4 class="
                    mb-4
                    font-medium
                    text-gray-900
                    dark:text-white
                ">
                    ${t('cases.documents.upload_title')}
                </h4>

                <div class="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    items-end
                ">

                    <div>

                        <label class="
                            block
                            mb-2
                            text-sm
                            font-medium
                            text-gray-900
                            dark:text-white
                        ">
                            ${t('cases.documents.type')}
                        </label>

                        <select
                            data-document-upload-key
                            class="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-gray-50
                                p-2.5
                                text-sm
                            "
                        >

                            <option value="">
                                ${t('cases.documents.select_document')}
                            </option>

                            ${
                                categories.map(category => `
                                    <option value="${category.key}">
                                        ${category.label}
                                    </option>
                                `).join('')
                            }

                        </select>

                    </div>


                    <div>

                        <label class="
                            block
                            mb-2
                            text-sm
                            font-medium
                            text-gray-900
                            dark:text-white
                        ">
                            ${t('cases.documents.file')}
                        </label>

                        <input
                            type="file"
                            data-document-upload-file
                            class="
                                block
                                w-full
                                text-sm
                                text-gray-900
                                border
                                border-gray-300
                                rounded-lg
                                cursor-pointer
                                bg-gray-50
                            "
                        />

                    </div>


                    <button
                        type="button"
                        data-document-upload-submit
                        class="
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            bg-primary-600
                            rounded-lg
                            hover:bg-primary-700
                        "
                    >
                        ${t('cases.documents.buttons.upload')}
                    </button>

                </div>

            </div>


            <!-- GENERATE -->

            <div class="
                border
                border-gray-200
                dark:border-gray-700
                rounded-lg
                p-5
            ">

                <h4 class="
                    mb-4
                    font-medium
                    text-gray-900
                    dark:text-white
                ">
                   ${t('cases.documents.generate_from_template')}
                </h4>

                <div class="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    items-end
                ">

                    <div>

                        <label class="
                            block
                            mb-2
                            text-sm
                            font-medium
                            text-gray-900
                            dark:text-white
                        ">
                            ${t('cases.documents.type')}
                        </label>

                        <select
                            data-document-generate-key
                            class="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-gray-50
                                p-2.5
                                text-sm
                            "
                        >

                            <option value="">
                                ${t('cases.documents.select_document')}
                            </option>

                            ${
                                categories.map(category => `
                                    <option value="${category.key}">
                                        ${category.label}
                                    </option>
                                `).join('')
                            }

                        </select>

                    </div>


                    <div>

                        <label class="
                            block
                            mb-2
                            text-sm
                            font-medium
                            text-gray-900
                            dark:text-white
                        ">
                            ${t('cases.documents.template')}
                        </label>

                        <select
                            data-document-generate-template
                            class="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-gray-50
                                p-2.5
                                text-sm
                            "
                        >

                            <option value="">
                                ${t('cases.documents.select_template')}
                            </option>

                            ${
                                documentTemplates.map(
                                    template => `
                                        <option
                                            value="${template.id}"
                                        >
                                            ${template.name}
                                        </option>
                                    `
                                ).join('')
                            }

                        </select>

                    </div>


                    <button
                        type="button"
                        data-document-generate-submit
                        class="
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            bg-primary-600
                            rounded-lg
                            hover:bg-primary-700
                        "
                    >
                        ${t('cases.documents.buttons.generate')}
                    </button>

                </div>

            </div>


            <!-- DOCUMENTS -->

            <div>

                <h4 class="
                    mb-3
                    font-medium
                    text-gray-900
                    dark:text-white
                ">
                    ${t('cases.documents.uploaded_documentslist')}
                </h4>

                <div
                    data-case-documents-list
                    class="space-y-2"
                >

                    ${
                        documents.length
                            ? documents.map(document => {

                                const category =
                                    categories.find(
                                        category =>
                                            category.key ===
                                            document.document_key
                                    );

                                return `
                                    <div class="
                                        flex
                                        items-center
                                        justify-between
                                        p-3
                                        rounded-lg
                                        border
                                        border-gray-200
                                        dark:border-gray-700
                                    ">

                                        <div>

                                            <div class="
                                                text-xs
                                                font-medium
                                                text-primary-600
                                                mb-1
                                            ">
                                                ${
                                                    category?.label
                                                    ??
                                                    document.document_key
                                                }
                                            </div>

                                            <div class="
                                                text-sm
                                                text-gray-900
                                                dark:text-white
                                            ">
                                                ${document.original_name}
                                            </div>

                                        </div>

                                        <div class="flex items-center gap-3">

																					${
																							document.metadata?.url
																									? `
																											<a
																													href="${document.metadata.url}"
																													target="_blank"
																													rel="noopener noreferrer"
																													class="
																															text-sm
																															text-primary-600
																															hover:underline
																													"
																											>
																													${t('cases.documents.buttons.download')}
																											</a>
																									`
																									: ''
																					}

																					<button
																							type="button"
																							data-case-document-delete="${document.id}"
																							data-document-name="${document.original_name}"
																							class="
																									px-3
																									py-1.5
																									text-sm
																									font-medium
																									text-red-600
																									border
																									border-red-200
																									rounded-lg
																									hover:bg-red-50
																									dark:hover:bg-red-900/20
																							"
																					>
																							${t('cases.documents.buttons.delete')}
																					</button>

																			</div>

                                    </div>
                                `;

                            }).join('')
                            : `
                                <div class="
                                    p-4
                                    text-sm
                                    text-gray-500
                                ">
                                    ${t('cases.documents.no_documents_yet')}
                                </div>
                            `
                    }

                </div>

            </div>

        </div>
    `;

		

    // ---------------------------------------------------------
    // Load Mask
    // ---------------------------------------------------------

			function setDocumentsLoading(
					container: HTMLElement,
					loading: boolean
			) {

					const root =
							container.querySelector(
									'[data-case-documents-root]'
							) as HTMLElement | null;

					if (!root) return;

					const overlay =
							root.querySelector(
									'[data-case-documents-loading]'
							) as HTMLElement | null;

					if (!overlay) return;

					overlay.classList.toggle(
							'hidden',
							!loading
					);

					const controls =
							root.querySelectorAll<
									HTMLButtonElement |
									HTMLSelectElement |
									HTMLInputElement
							>(
									'button, select, input'
							);

					controls.forEach(
							control => {

									control.disabled = loading;

									if (control instanceof HTMLButtonElement) {

											control.classList.toggle(
													'opacity-50',
													loading
											);

											control.classList.toggle(
													'cursor-not-allowed',
													loading
											);

											control.classList.toggle(
													'bg-gray-400',
													loading
											);

											control.classList.toggle(
													'hover:bg-gray-400',
													loading
											);

											control.classList.toggle(
													'bg-primary-600',
													!loading
											);

											control.classList.toggle(
													'hover:bg-primary-700',
													!loading
											);

									}

							}
					);
			}

    // ---------------------------------------------------------
    // Upload
    // ---------------------------------------------------------

    const uploadKey =
        container.querySelector(
            '[data-document-upload-key]'
        ) as HTMLSelectElement;

    const uploadFile =
        container.querySelector(
            '[data-document-upload-file]'
        ) as HTMLInputElement;

    const uploadButton =
        container.querySelector(
            '[data-document-upload-submit]'
        ) as HTMLButtonElement;


    uploadButton.addEventListener(
        'click',
        async () => {

            const documentKey =
                uploadKey.value;

            const file =
                uploadFile.files?.[0];

            if (!documentKey || !file) {
                return;
            }

            const data =
								new FormData();

						data.append(
								'document',
								documentKey
						);

						data.append(
								'key',
								documentKey
						);

						data.append(
								'document_key',
								documentKey
						);

						data.append(
								'file',
								file
						);

						setDocumentsLoading(container,true);

						try {

								await uploadCaseDocument(
										caseId,
										data
								);

								await renderCaseDocuments({
										container,
										caseId,
										caseType,
										documentTemplates
								});

						} catch (error) {

								console.error(
										'Error uploading document',
										error
								);

						} finally {

								setDocumentsLoading(container,false);

						}

        }
    );


    // ---------------------------------------------------------
    // Generate
    // ---------------------------------------------------------

    const generateKey =
        container.querySelector(
            '[data-document-generate-key]'
        ) as HTMLSelectElement;

    const generateTemplate =
        container.querySelector(
            '[data-document-generate-template]'
        ) as HTMLSelectElement;

    const generateButton =
        container.querySelector(
            '[data-document-generate-submit]'
        ) as HTMLButtonElement;


    generateButton.addEventListener(
        'click',
        async () => {

            const documentKey =
                generateKey.value;

            const templateId =
                Number(
                    generateTemplate.value
                );

            if (!documentKey || !templateId) {
                return;
            }

						 setDocumentsLoading(container,true);

							try {

									await generateCaseDocument(
											caseId,
											{
													template_id:
															templateId,

													document_key:
															documentKey
											}
									);

									await renderCaseDocuments({
											container,
											caseId,
											caseType,
											documentTemplates
									});

							} catch (error) {

									console.error(
											'Error generating document',
											error
									);

							} finally {

									setDocumentsLoading(container,false);

							}

        }
    );

		// ---------------------------------------------------------
		// Delete
		// ---------------------------------------------------------

		const deleteButtons =
				container.querySelectorAll<HTMLButtonElement>(
						'[data-case-document-delete]'
				);

		deleteButtons.forEach(
				button => {

						button.addEventListener(
								'click',
								() => {

										const documentId =
												Number(
														button.dataset.caseDocumentDelete
												);

										if (!documentId) {
												return;
										}

										const documentName =
												button.dataset.documentName
												?? 'this document';

										const svgString = `
												<svg
														class="w-16 h-16 mx-auto text-red-600"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
												>
														<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
														></path>
												</svg>
										`;

										confirmAction({

												modalId:
														'delete-cases-modal',

												svg:
														svgString,

												title:
														t('common.messages.remove'),

												message:
														`${t('common.messages.shure_remove')}: ${documentName}`,

												onConfirm:
														async () => {

																setDocumentsLoading(
																		container,
																		true
																);

																try {

																		await deleteCaseDocument(
																				documentId
																		);

																		await renderCaseDocuments({
																				container,
																				caseId,
																				caseType,
																				documentTemplates
																		});

																} catch (error) {

																		console.error(
																				'Error deleting document',
																				error
																		);

																		throw error;

																} finally {

																		setDocumentsLoading(
																				container,
																				false
																		);

																}

														},

												successMessage:
														t('common.messages.deleted'),

												errorMessage:
														t('common.errors.UNKNOWN')

										});

								}
						);

				}
		);

}

async function openGenerateDocument(
    container: HTMLElement,
    caseId: number,
    documentKey: string,
    documentTemplates: any[]
) {

    const templateOptions =
        documentTemplates
            .map(template => `
                <option value="${template.id}">
                    ${template.name}
                </option>
            `)
            .join('');

    const modal =
        document.createElement('div');

    modal.className = `
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
    `;

    modal.innerHTML = `
        <div class="
            w-full
            max-w-md
            rounded-lg
            bg-white
            dark:bg-gray-800
            p-6
        ">

            <h3 class="
                mb-4
                text-lg
                font-semibold
                text-gray-900
                dark:text-white
            ">
                Generate document
            </h3>

            <label class="
                block
                mb-2
                text-sm
                font-medium
                text-gray-900
                dark:text-white
            ">
                Template
            </label>

            <select
                data-template
                class="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    p-2.5
                "
            >
                ${templateOptions}
            </select>

            <div class="
                flex
                justify-end
                gap-2
                mt-6
            ">

                <button
                    type="button"
                    data-cancel
                    class="
                        px-4
                        py-2
                        text-sm
                        rounded-lg
                        border
                        border-gray-300
                    "
                >
                    Cancel
                </button>

                <button
                    type="button"
                    data-generate
                    class="
                        px-4
                        py-2
                        text-sm
                        text-white
                        bg-primary-600
                        rounded-lg
                    "
                >
                    Generate
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
        modal.remove();
    };

    modal
        .querySelector('[data-cancel]')
        ?.addEventListener(
            'click',
            close
        );

    modal
        .querySelector('[data-generate]')
        ?.addEventListener(
            'click',
            async () => {

                const select =
                    modal.querySelector(
                        '[data-template]'
                    ) as HTMLSelectElement;

                const templateId =
                    Number(select.value);

                if (!templateId) return;

                try {

                    await generateCaseDocument(
                        caseId,
                        {
                            template_id:
                                templateId,

                            document_key:
                                documentKey
                        }
                    );

                    close();

                    await renderCaseDocuments({
                        container,
                        caseId,
                        caseType:
                            (
                                container as any
                            ).__caseType,

                        documentTemplates
                    });

                } catch (error) {

                    console.error(
                        'Error generating document',
                        error
                    );

                }

            }
        );

}
