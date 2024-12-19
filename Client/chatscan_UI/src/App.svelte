<script>
import {Router,Route} from "svelte-routing";
    import Login from "./lib/Components/HomePage/Login.svelte"
    import Register from "./lib/Components/HomePage/Register.svelte";
    import Home from "./lib/Components/HomePage/Socket_Client/Home.svelte";
  import ChatRoom from "./lib/Components/HomePage/Socket_Client/chatRoom.svelte";
</script>

<Router>
    <Route path="/" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/home" component={Home}/>
    <Route path="/chat/:room_id" component={ChatRoom} />
</Router>
