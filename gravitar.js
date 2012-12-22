$(window).load(function(){

    var x = 0,
        y = 0,
        r = 0,
        vx = 0,
        vy = 0,
        vr = 0,
        ax = 0,
        ay = 0,
        sphere = document.getElementsByTagName('i')[0],
        $sphere = $(sphere),
        sphereHeight = $sphere.height(),
        sphereWidth = $sphere.width()
    ;

    function changePicToHash(){
        if (document.location.hash) {
            $('i').css(
                'background-image',
                'url("http://gravatar.com/avatar/' + CryptoJS.MD5(document.location.hash.substr(1)) + '?s=256&d=http%3A%2F%2Fgravitar.me/transparent.png")'
            );
        }
    }

    function boundingBoxCheck() {
        var collision = false;
        if (x < 0) {
            x = 0;
            vx = -vx;
            vr = vy;
            collision = true;
        }
        if (y < 0) {
            y = 0;
            vy = -vy;
            vr = -vx;
            collision = true;
        }
        if (x > document.documentElement.clientWidth - sphereWidth) {
            x = document.documentElement.clientWidth - sphereWidth;
            vx = -vx;
            vr = -vy;
            collision = true;
        }
        if (y > document.documentElement.clientHeight - sphereHeight) {
            y = document.documentElement.clientHeight - sphereHeight;
            vy = -vy;
            vr = vx;
            collision = true;
        }
        if (collision) {
            bounce();
        }
        return collision;
    }

    function startGame() {
        if (window.DeviceMotionEvent !== undefined) {
            window.ondevicemotion = function (e) {
                ax = event.accelerationIncludingGravity.x * 5;
                ay = event.accelerationIncludingGravity.y * 5;
            };
        } else {
            //ax = 3;
            ay = -8;
            //x = parseInt(($(window).width() - sphereWidth)/ 2, 10);
            y = parseInt(($(window).height() - sphereHeight)/ 2, 10);
            x = parseInt(($(window).width() - sphereWidth)/ 2, 10);
        }

        if (document.location.hash) {
            $('input').val(document.location.hash.substr(1) || '');
        }

        $('input').bind('change keyup keypress', function(){
            location.href = '#' + $(this).val();
        });

        $('i').click(function(){
            $('#overlay').show().css('opacity', 1);
        });

        $('button').bind('click', function(){
            $('#overlay').css('opacity', 0);
            setTimeout(function(){
                $('#overlay').hide();
            }, 3000);
        });

        setInterval(function(){
            var landscapeOrientation = window.DeviceMotionEvent === undefined ? false : window.innerWidth / window.innerHeight > 1;

            if (landscapeOrientation) {
                vx = vx + ay;
                vy = vy + ax;
            } else {
                vy = vy - ay;
                vx = vx + ax;
            }

            vx = vx * 0.98;
            vy = vy * 0.98;

            r = parseInt(r + vr / 50, 10);
            y = parseInt(y + vy / 50, 10);
            x = parseInt(x + vx / 50, 10);

            boundingBoxCheck();

            $sphere.css('-webkit-transform', 'rotate(' + r + 'deg)');
            sphere.style.top = y + 'px';
            sphere.style.left = x + 'px';

            //console.log('x', x, 'y', y, 'ax', parseInt(ax, 10), 'ay', parseInt(ay, 10), 'vx', parseInt(vx, 10), 'vy', parseInt(vy, 10));
        }, 25);
    }

    function bounce() {
        if (window._timeout)
            clearTimeout(window._timeout);

        $sphere.addClass('bounced');

        window._timeout = setTimeout(function(){
            $sphere.removeClass('bounced');
        }, 100);
    }

    $(window).bind('hashchange', changePicToHash);
    changePicToHash();

    startGame();

});