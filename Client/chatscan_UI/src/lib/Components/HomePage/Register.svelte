<script>
    import { navigate } from "svelte-routing";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let display_name = "";
    let errorMessage = "";
    let successMessage = "";
    let isAuthenticated = false;
  
    async function signUp(e) {
      e.preventDefault();
      console.log({ email, password, confirmPassword });
      try {
        const response = await fetch("http://localhost:4000/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            confirmPassword,
            display_name,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          // window.alert("Registration successful! ");
          successMessage = "Registration successful! You can now log in.";
          isAuthenticated = false; // Set to false until the user logs in
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          errorMessage = result.message || "Sign-up failed. Please try again.";
        }
      } catch (error) {
        errorMessage = "Sign-up failed. Please check your details and try again.";
        console.error(error);
      }
    }
    const signIn = () => {
      navigate("/");
    };
  </script>

  
<div class="signup-page">
    <div class="overlay">
      <div class="wrapper">
        <div class="container">
          <h2 class="heading">Create Account</h2>
          <!-- <h5 class="subheading">Join us and start your journey</h5> -->
          <!-- Input fields -->
          <input type="text" placeholder="Display Name" bind:value={display_name} />
          <input type="email" placeholder="Email" bind:value={email} />
          <input type="password" placeholder="Password" bind:value={password} />
          <input
            type="password"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
          />
  
          <div class="btn-container">
            <button class="btn-signup" on:click={signUp}>Sign Up</button>
          </div>
          <div class="btn-container">
            <button class="btn-login" on:click={signIn}>
              Already have an account?
            </button>
          </div>
  
          <!-- Display messages -->
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
  
  <style>
    .signup-page .overlay {
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
      background: black;
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
  
    .btn-signup {
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
  
    .btn-signup:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
    }
  
    .btn-login {
      padding: 12px;
      font-size: 16px;
      color: #4a90e2;
      background: none;
      border: 2px solid #4a90e2;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;
    }
  
    .btn-login:hover {
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
  
    p {
      font-size: medium;
    }
  </style>
  
  
  