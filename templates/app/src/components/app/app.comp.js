const AppComponent = {
    selector: 'plantum-app',
    templateUrl: './app.comp.html',
    styleUrl: './app.comp.css',

    inputs: [],
    outputs: [],
    inject: [],

    state: () => ({
        title: '{{ appName }}'
    }),

    onInit(ctx) {
        // called once before first render
    },

    onMount(ctx) {
        // called after template rendered into host
    },

    onDestroy(ctx) {
        // cleanup placeholder
    },

    onGrowGuideClick(ctx) {
        window.location.href = 'https://plantum.dev/docs';
    }
};

AppComponent.__url__ = import.meta.url;

export default AppComponent;