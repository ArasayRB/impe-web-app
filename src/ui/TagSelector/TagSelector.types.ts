export interface TagItem{

    id:number;

    label:string;

    data?:any;

}

export interface TagSelectorProps{

    value:TagItem[];

    placeholder?:string;

    noResultsText?:string;

    searchingText?:string;

    createText?:(text:string)=>string;

    max?:number;

    disabled?:boolean;

    readonly?:boolean;

    search(

        text:string

    ):Promise<TagItem[]>;

    create?(

        text:string

    ):Promise<TagItem>;

    onCreateRequested?:(
        text:string
    )=>Promise<TagItem | undefined>;

    onChange?(

        value:TagItem[]

    ):void;

}