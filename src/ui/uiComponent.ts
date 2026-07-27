export abstract class UIComponent<TProps> {

    protected mounted = false;

    constructor(

        protected container: HTMLElement,

        protected props: TProps

    ) {}

    abstract render(): void;

    mount() {

        if (this.mounted) {

            return;

        }

        this.render();

        this.mounted = true;

    }

    update(

        props: Partial<TProps>

    ) {

        this.props = {

            ...this.props,

            ...props

        };

        this.render();

    }

    destroy() {}

}