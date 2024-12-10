<script>

  import { jwtDecode } from "jwt-decode";
  import { navigate } from "svelte-routing";
  // Import userRole store
  let email = "";
  let password = "";
  let errorMessage = "";
  let successMessage = "";
  let isAuthenticated = false;
  let user = "";

  const login = async () => {
  if (!email || !password) {
    errorMessage = "Email and Password are required";
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    // console.log(result); // Debug the response

    if (response.ok) {
      localStorage.setItem("jwtToken", result.token);
      const decodedToken = jwtDecode(result.token);
      successMessage = "Login Successful";
      isAuthenticated = true;
      navigate("/home")
 // Ensure `navigate` is correctly used
    } else {
      errorMessage = result.message || "Sign-in failed. Please check your credentials.";
    }
  } catch (error) {
    errorMessage = "Sign-in failed. Please try again later.";
    console.error(error);
  }
};

  const handleSignup = () => {
    navigate("/register");
  };

</script>

<!-- <body> -->
  <div class="login-page">
    <div class="overlay">
      <div class="wrapper">
        <div class="container">
          <h2 class="heading">ChatScan</h2>
          <h5 class="subheading">We're so excited to see you again</h5>
          <input type="email" placeholder="Email" bind:value={email} />
          <input type="password" placeholder="Password" bind:value={password} />
          <div class="btn-container">
            <button class="btn-signin" on:click={login}>Sign in</button>
          </div>
          <div class="btn-container">
            <button class="btn-create" on:click={handleSignup}>Create a New Account</button>
          </div>
          {#if successMessage}
            <p class="success">{successMessage}</p>
          {/if}
          {#if errorMessage}
            <p class="error">{errorMessage}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
<!-- </body> -->

<!-- </body>
</html> -->

<style>


.login-page .overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  max-width: 400px;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background:   black;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.heading {
  font-size: 2rem;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 0.5rem;
}

.subheading {
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
  outline: none;
}

.btn-container {
  margin-top: 1rem;
}

.btn-signin {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #4a90e2, #56d6e3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-signin:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.btn-create {
  padding: 12px;
  font-size: 16px;
  color: #4a90e2;
  background: none;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.btn-create:hover {
  background: #4a90e2;
  color: white;
}

.success {
  color: #4caf50;
  margin-top: 1rem;
}

.error {
  color: #f44336;
  margin-top: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
p{
  font-size: medium;
}

</style>
