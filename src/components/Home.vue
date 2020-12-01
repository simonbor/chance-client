<template>
    <div class="home">
        <div class="map"></div>
        <div class="row">
            <div class="col-md-4">
                <h3>שיתוף חניות בעזרת המפה?</h3>
                <p class="text">
                    בעזרת האפליקציה ניתן לעדכן זמן פינוי החניה וגם לראות על גבי המפה חניות שהתפנו לפני רגע או אלה שעומדות להתפנות בקרוב. אם כולנו יחד נעדכן פינויים נוכל לעזור אחד לשני</p>
                <p>
                    <b-link role="button" class="btn btn-secondary" :to="{ name: 'About' }">עוד פרטים »</b-link>
                </p>
            </div>

            <div class="col-md-4">
                <h3>יתרונות המערכת</h3>
                <p class="text">
                    <ul>
                        <li>ניתן לראות על גבי המפה את מיקומם של החניות שמתפנות או אלה שעומדות להתפנה בקרוב</li>
                        <li>ניתן לנווט לחניה הרצויה</li>
                        <li>אין צורך בקבוצות חניה ווצאפ המרובות</li>
                    </ul>
                </p>
                <p>
                    <b-link class="btn btn-primary" :to="{ name: 'Register' }" role="button">להרשמה! »</b-link>
                </p>
            </div>

            <div class="col-md-4">
                <h3>איך זה עובד...</h3>
                <p class="text">
                    כל פעם כאשר נרצה לפנות חניה יש לכתוב כתובת החניה וזמן הפינוי בקבוצה של המערכת. לאחר שליחת ההודעה יופיע סמן על גבי מפת המערכת כך שמי שמעוניין לחנות יוכל לראות איפה ומתי הולכת להתפנות חניה</p>
                <p>
                    <b-link role="button" class="btn btn-secondary" :to="{ name: 'About' }">עוד פרטים »</b-link>
                </p>
            </div>
        </div>
        <div class="status">
            <h3>*נכון לרגע זה ישנם חניות פנויות במערכת!</h3>
        </div>
        <hr>
    </div>
</template>

<script>
    import image from "../assets/map.png"

    export default {
        data () {
            return {
                msg: 'Home!',
                image: image
            }
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: circle;
    }
    p {
        font-size: larger;
    }
    .map {
        border: solid 0px rgba(0, 0, 0, 0.3);
        height: 260px;
        padding: 0px;
        margin: 25px 0px;
        margin-bottom: 50px;
        border-radius: 8px;
        background-image: url(../assets/map.png);
        background-position: 50%;
    }
    .home {
        direction: rtl;
    }
    .home p.text, .status h3 {
        text-align: right;
    }
    .status {
        display: none;
    }
</style>