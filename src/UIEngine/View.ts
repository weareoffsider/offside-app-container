

interface ViewOptions<UIData, ViewData> {
  preLoad?(props: UIData): Promise<any>;
  postLoad?(props: UIData): Promise<any>;
  createView?(props: UIData): ViewData;
  updateView?(props: UIData, data: ViewData): ViewData;
  destroyView?(props: UIData, data: ViewData): void
}

export default class View<UIData, ViewData> {

  constructor (options: ViewOptions<UIData, ViewData>) {
  }
}
