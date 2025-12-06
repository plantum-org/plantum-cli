const MeinTestLeafComponent = {
    selector: 'mein-test-leaf',
    templateUrl: './mein-test-leaf.comp.html',
    styleUrl: './mein-test-leaf.comp.css',

    inputs: [],
    outputs: [],
    inject: [],

    state: () => ({
        title: 'mein-test-leaf works!'
    }),

    onInit(ctx) { },
    onMount(ctx) { },
    onDestroy(ctx) { },

    onClick(ctx) {
        console.log('mein-test-leaf clicked');
    }
};

MeinTestLeafComponent.__url__ = import.meta.url;

export default MeinTestLeafComponent;