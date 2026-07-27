export interface CrudCellComponent<T> {

    mount(
        container: HTMLElement,
        value: any,
        row: T
    ): void;

}

export type CrudColumn<T> = {
  key: string;
  label: string;

  render?: (
    value: any,
    row: T,
    t: any
  ) => string;

  component?: CrudCellComponent<T>;
};
