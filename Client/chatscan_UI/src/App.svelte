<script>
import {Router,Route} from "svelte-routing";
    import Login from "./lib/Components/HomePage/Login.svelte"
    import Register from "./lib/Components/HomePage/Register.svelte";
</script>

<Router>
    <Route path="/" component={Login} />
    <Route path="/register" component={Register} />
</Router>
