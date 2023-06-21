<template>


    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">CO<sub>2</sub> App</a>
        <div class="navbar-brand"> Wilkommen {{ user }} 👋!</div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Sign-in</a>
            </li>
            
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Profiles
              </a>
              <ul class="dropdown-menu">
                <li v-for="(profile) in profiles"><a class="dropdown-item" href="#">{{ profile }}</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>


<script>

    export default{

        data(){
            return{
                user: "user_name",
                profiles:[
                    "profil1",
                    "profil2",
                    "profil3"
                ]
            }
        }
    }

</script>

<style scoped>

  
    .navbar-brand{
        font-size: 1.5em;
        
    }
</style>
