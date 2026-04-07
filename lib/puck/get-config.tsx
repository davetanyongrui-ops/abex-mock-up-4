import { config } from "@/lib/puck/config";
import { ProductCatalog as RealProductCatalog } from "@/components/site/ProductCatalog";
import { ProjectTimeline as RealProjectTimeline } from "@/components/site/ProjectTimeline";
import { ContactForm as RealContactForm } from "@/components/site/ContactForm";

/**
 * Returns a specialized Puck configuration based on the page slug.
 * This ensures that common components (ContactForm, ProductCatalog, etc.)
 * use their real, interactive implementations in both public and admin views.
 */
export function getPuckConfig(slug: string) {
    if (slug === 'products') {
        return {
            ...config,
            components: {
                ...config.components,
                ProductCatalog: {
                    ...config.components.ProductCatalog,
                    render: (props: any) => config.components.ProductCatalog.render({
                        ...props,
                        renderCatalog: () => <RealProductCatalog />
                    })
                }
            }
        };
    }

    if (slug === 'projects') {
        return {
            ...config,
            components: {
                ...config.components,
                ProjectTimeline: {
                    ...config.components.ProjectTimeline,
                    render: (props: any) => config.components.ProjectTimeline.render({
                        ...props,
                        renderTimeline: () => <RealProjectTimeline />
                    })
                }
            }
        };
    }

    if (slug === 'contact') {
        return {
            ...config,
            components: {
                ...config.components,
                ContactForm: {
                    ...config.components.ContactForm,
                    render: (props: any) => config.components.ContactForm.render({
                        ...props,
                        renderForm: () => <RealContactForm />
                    })
                }
            }
        };
    }

    if (slug === 'index' || slug === 'home') {
        return {
            ...config,
            components: {
                ...config.components,
                ContactForm: {
                    ...config.components.ContactForm,
                    render: (props: any) => config.components.ContactForm.render({
                        ...props,
                        renderForm: () => <RealContactForm />
                    })
                },
                ProductCatalog: {
                    ...config.components.ProductCatalog,
                    render: (props: any) => config.components.ProductCatalog.render({
                        ...props,
                        renderCatalog: () => <RealProductCatalog />
                    })
                }
            }
        };
    }

    return config;
}
