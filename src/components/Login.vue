<template>
    <div>
        <h4>Login</h4>
        <form>
            <label for="phone" >Mobile Number</label>
            <div>
                <input id="phone" type="phone" v-model="phone" required autofocus>
            </div>
            <label for="password">Password</label>
            <div>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <label></label>
            <div>
                <button type="submit" @click="handleSubmit">
                    Login
                </button>
            </div>
        </form>
        <div>
            <p class="register">
                Don't have an account? Register 
                <b-link :to="{ name: 'Register' }">here</b-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
    label {
        margin-top: 5px;
    }
    .register {
        margin-top: 20px;
        font-size: smaller;
    }
</style>

<script>
    import EventBus from '../event-bus.js'
    const config = require('config');
    export default {
        components: {
            EventBus
        },
        data(){
            return {
                phone : "",
                password : ""
            }
        },
        mounted() {
            // wake up free dyno servers
            fetch(`${config.authUrl}/wakeup`);
            fetch(`${config.apiUrl}/wakeup`);
        },
        methods : {
            handleSubmit(e){
                e.preventDefault()
                if (this.password.length > 0) {

                    fetch(`${config.authUrl}/login`, {
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            User: {
                                MobileNum: this.phone,
                                Password: this.password
                            }
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(data.auth) {
                            let is_admin = data.user.RoleId;
                            localStorage.setItem('user',JSON.stringify(data.user));
                            localStorage.setItem('jwt', data.token);

                            if (localStorage.getItem('jwt') != null){
                                // this.$emit('loggedIn')
                                EventBus.$emit('loggedIn')
                                if(this.$route.params.nextUrl != null){
                                    this.$router.push(this.$route.params.nextUrl)
                                } else {
                                    if(is_admin == 1){
                                        this.$router.push('map')
                                    }
                                    else {
                                        this.$router.push('map')
                                    }
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        console.error(error.response);
                    });
                }
            }
        }
    }
</script>