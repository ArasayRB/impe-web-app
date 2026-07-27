export interface RefreshableRenderer {

    field: any;

    refresh?(definition:any): void;

}

export class DefinitionRegistry{

    private renderers: RefreshableRenderer[] = [];

    register(renderer:RefreshableRenderer){

        this.renderers.push(renderer);

    }

    clear(){

        this.renderers.length = 0;

    }

    refresh(definition:any){
        console.log(

            "5. registry.refresh",

            definition,

            this.renderers

        );

        for(const renderer of this.renderers){
            
            console.log(
                renderer.field.key,
                renderer.field.dependsOn,
                renderer.field.type
            );


            if(renderer.refresh){

                renderer.refresh(definition);

            }

        }

    }

}