class RequireAuth {
    constructor(context) {
        this.context = context;
    }
    async withAuth(fn, ...args) {
        if (this.context?.auth) {
            return await fn(args);
        }
    }
}