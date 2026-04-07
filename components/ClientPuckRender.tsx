"use client";

import { Render } from "@measured/puck";
import { config } from "@/lib/puck/config";
import { ContactForm as RealContactForm } from "@/components/site/ContactForm";
import { ProductCatalog as RealProductCatalog } from "@/components/site/ProductCatalog";
import { ProjectTimeline as RealProjectTimeline } from "@/components/site/ProjectTimeline";

interface ClientPuckRenderProps {
    data: any;
}

export function ClientPuckRender({ data }: ClientPuckRenderProps) {
    // Inject real components into config for this render on the client side
    // This avoids passing functions from Server Components to Client Components
    const clientConfig = {
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
            },
            ProjectTimeline: {
                ...config.components.ProjectTimeline,
                render: (props: any) => config.components.ProjectTimeline.render({
                    ...props,
                    renderTimeline: () => <RealProjectTimeline />
                })
            }
        }
    };

    return <Render config={clientConfig as any} data={data} />;
}
