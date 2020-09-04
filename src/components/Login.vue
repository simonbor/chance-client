<template>
    <div>
        <h4>Login</h4>
        <form>
            <div>
                <label for="password" >Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                <button type="submit" @click="handleSubmit">
                    Login
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                password : ""
            }
        },
        methods : {
            handleSubmit(e){
                e.preventDefault()
                if (this.password.length > 0) {
                    this.$http.post('https://chance-app.herokuapp.com/login', {
                        // this.$http.post('http://localhost:8080/login', {
                        Driver: { MobileNum: this.password }
                    })
                    .then(response => {
                        response.data.auth && localStorage.setItem('user',JSON.stringify(response.data.user))
                        response.data.auth && localStorage.setItem('jwt',response.data.token)

                        if (localStorage.getItem('jwt') != null) {
                            this.$emit('loggedIn')
                            if(this.$route.params.nextUrl != null){
                                this.$router.push(this.$route.params.nextUrl)
                            }
                            else {
                                this.$router.push('dashboard')
                            }
                        }
                    })
                    .catch(function (error) {
                        console.error(error.message);
                    });
                }
            }
        }
    }
</script>