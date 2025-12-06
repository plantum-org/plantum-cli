const __className__Component = {
    selector: '__name__',
    templateUrl: './__name__.comp.html',
    styleUrl: './__name__.comp.css',

    inputs: [],
    outputs: [],
    inject: [],

    state: () => ({
        title: '__name__ works!'
    }),

    onInit(ctx) { },
    onMount(ctx) { },
    onDestroy(ctx) { },

    onClick(ctx) {
        console.log('__name__ clicked');
    }
};

__className__Component.__url__ = import.meta.url;

export default __className__Component;