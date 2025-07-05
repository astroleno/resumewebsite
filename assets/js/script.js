(function ($) {
    "use strict";


    //bootstrap tooltip js  更多下载：https://www.bootstrapmb.com 
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


    /* ============================================================ */
    /* PRELOADER
    /* ============================================================ */
    $(window).on('load', function() {
        $(".preloader").fadeOut();     
    });


    $(document).ready(function () {
        var menuLinks = $('.nav-menu li a:not([href="#"])');
        var sections = [];
        var isScrolling = false;
    
        // Map each menu link to its target section
        function updateSections() {
            sections = [];
            menuLinks.each(function () {
                var target = $(this.hash);
                if (target.length) {
                    sections.push({
                        id: this.hash,
                        offsetTop: target.offset().top
                    });
                }
            });
        }
    
        updateSections();
    
        // Function to update the active class
        function updateActiveLink() {
            if (isScrolling) return;
    
            var scrollPos = $(window).scrollTop() + $(window).height() / 3; // Check near the middle of the viewport
            var currentSectionId = '';
    
            sections.forEach(function (section) {
                if (scrollPos >= section.offsetTop) {
                    currentSectionId = section.id;
                }
            });
    
            // Add active class to the corresponding menu item
            $('.nav-menu li a').removeClass('active');
            menuLinks.each(function () {
                if (this.hash === currentSectionId) {
                    $(this).addClass('active');
                }
            });
        }
    
        // Update active link on scroll
        $(window).on('scroll', updateActiveLink);
    
        // Smooth scroll on click
        menuLinks.click(function (e) {
    
            var target = $(this.hash);
            if (target.length) {
                isScrolling = true;
    
                $('html, body').animate(
                    { scrollTop: target.offset().top + 10 }, // Smooth scroll to the section
                    200, 
                    function () {
                        isScrolling = false;
                        updateActiveLink(); // Ensure correct active link after scrolling
                    }
                );
    
                // Add current class to clicked link immediately
                $('.nav-menu li a').removeClass('active');
                $(this).addClass('active');
            }
        });
    
        // Recalculate section offsets on window resize
        $(window).on('resize', updateSections);
    });
    
   

    /* ============================================================ */
    /* mobile menu activation js here 
    /* ============================================================ */
    function mobile_menu(selector, actionSelector) {
        var mobile_menu = $(selector);
        mobile_menu.on("click", function() {
            $(selector).toggleClass('sidemenu-open');
        });
        
        var hamburgerbtn = $(selector);
        hamburgerbtn.on("click", function() {
            $(actionSelector).toggleClass('sidemenu-open');
        });

        $(document).on('click', function(e) {
            var selectorType = $(actionSelector).add(mobile_menu);
            if (selectorType.is(e.target) !== true && selectorType.has(e.target).length === 0) {
                $(actionSelector).removeClass("sidemenu-open");
                $(selector).removeClass("sidemenu-open");
            }
        });
        // $(".menu_wrapper a").on('click', function() {
        //     $('.menu_wrapper, .menu-overlay').removeClass("sidemenu-open");
        // });
    
    };
    mobile_menu('.navbar-toggler, .sidebar-menu-overlay, .close-btn', '.mobile-menu');  



    /* ============================================================ */
    /* StickyHeader
    /* ============================================================ */
    var header = $("header");
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
    
        if (scrollPosition > 60) {
            header.addClass('sticky');
        } else {
            header.removeClass('sticky');
        }
    });
    /* ============================================================ */
    /* Swiper Slider Init
    /* ============================================================ */
    // Homepage Signup Side Slider
    let testimonialSlider = new Swiper ('.testimonial-slider', {
        spaceBetween: 50,
        slidesPerView: 1,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000
        },
        breakpoints: {
            576: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 2,
            },
        },
        navigation: {
            nextEl: ".testimonial-slider .swiper-button-next",
            prevEl: ".testimonial-slider .swiper-button-prev",
        },
        pagination: {
            el: ".testimonial-slider .swiper-pagination",
            clickable: true,
        },
    });

            
    // Protfolio details image slider activation js
    let protfolioDetails = new Swiper(".protfolio-details-slider", {
        cssMode: true,
        navigation: {
            nextEl: ".protfolio-details-slider .swiper-button-next",
            prevEl: ".protfolio-details-slider .swiper-button-prev",
        },
        pagination: {
            el: ".protfolio-details-slider .swiper-pagination",
            clickable: true,
        },
        mousewheel: true,
        keyboard: true,
    });
    
    // Clients Logo Slider Animation
    document.querySelectorAll('.logo-slider').forEach(function(slider) {
        var reverseDirection = slider.getAttribute('data-reverse') === 'true';
    
        new Swiper(slider, {
            loop: true,  
            slidesPerView: 2,
            spaceBetween: 20,
            speed: 5000,
            autoplay: {
                delay: 0,  
                disableOnInteraction: false,  
                reverseDirection: reverseDirection
            },
            breakpoints: {
                576: {
                    slidesPerView: 3,
                },
                1200: {
                    slidesPerView: 3,
                },
                1440: {
                    slidesPerView: 4,
                },
            },
        });
    });

            
    /* ============================================================ */
    /* Scroll Top
    /* ============================================================ */
    // 已废弃原有返回顶部按钮，相关js全部删除，仅保留呼吸圆环按钮

    /* ============================================================ */
    /* Portfolio Isotop
    /* ============================================================ */
    $(window).on("load resize",function(e){ 
        var $container = $('.protfolio-container'),
        isotope = function () {
            $container.isotope({
                resizable: true,
                itemSelector: '.grid-item',
                layoutMode: 'packery',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-item',
                },
                hiddenStyle: {
                    transform: 'scale(.2) skew(30deg)',
                    opacity: 0
                },
                visibleStyle: {
                    transform: 'scale(1) skew(0deg)',
                    opacity: 1,
                },
                transitionDuration: '.5s',
            });
        };
        isotope(); 

        var $isotopefilters = $('.protfolio-menu');
        $isotopefilters.on( 'click', 'button', function() {
            $(this).addClass('active').siblings().removeClass('active');

            var filterValue = $( this ).attr('data-filter');
            $container.isotope({ 
                filter: filterValue 
            });
        });
    }); 


    //image galery activation js
    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
        plyr: {
            config: {
                ratio: '16:9', // or '4:3'
                muted: false,
                hideControls: true,
                youtube: {
                    noCookie: true,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3
                },
                vimeo: {
                    byline: false,
                    portrait: false,
                    title: false,
                    speed: true,
                    transparent: false
                }
            }
        }
    });


    //counter up plugin js
    $(document).ready(function($) {
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });
    });

    // wow animation js activation here 
    let wow = new WOW({
        mobile: false,
    });
    wow.init();

    //circle progress bar script here
    let options = {
        startAngle: -1.55,
    }
    var codingSkills = $('.coding-skills');
    if (codingSkills.length > 0) {
        codingSkills.waypoint(function() {
            $(".circle .bar").circleProgress({
                startAngle: 1,
                emptyFill: '#DEDEFF',
            }).on('circle-animation-progress',
                function(event, progress, stepValue){
                  $(this).parent().find(".box").text(String(stepValue.toFixed(2).substr(2)) + "%");
                }
            );
        },{ 
            offset: '100%'
        });
    }; 

    // skill progressbar script here
    var croWey = $('.skill-progress');
    if (croWey.length > 0) {
        croWey.waypoint(function () {
            $('.skill-bar').each(function () {
                var percentage = $(this).attr('data-percentage');

                $(this).find('.progress-content').animate({
                    width: percentage
                }, 2000);
                $(this).find('.progress-mark-percent').animate({
                    left: percentage,
                },
                {
                    duration: 2000,
                    step: function (now, fx) {
                        var data = Math.round(now);
                        $(this).html(percentage);
                    },
                });
            });
        }, {
            offset: '100%'
        });
    };

    
})(jQuery);


if (localStorage.theme === 'dark' ) {
    document.documentElement.classList.add('dark');
    $('.btn_theme_switch').removeClass('btn-light').addClass('btn-dark');
} else {
    document.documentElement.classList.remove('dark');
    $('.btn_theme_switch').removeClass('btn-dark').addClass('btn-light');
}
// Function to set dark theme
function setDarkTheme() {
    document.documentElement.classList.add("dark");
    localStorage.theme = 'dark';
    $('.btn_theme_switch').removeClass('btn-light').addClass('btn-dark');
}

// Function to set light theme
function setLightTheme() {
    document.documentElement.classList.remove("dark");
    localStorage.theme = 'light';
    $('.btn_theme_switch').removeClass('btn-dark').addClass('btn-light');
}

// Function to get URL parameters
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
// Check if version parameter is provided in the URL and apply the theme accordingly
var version = getUrlParameter('version');
if (version) {
    if (version === 'dark') {
        setDarkTheme();
    } else if (version === 'light') {
        setLightTheme(); 
    }
}
// Event listener for clicks on the theme switch button
$(".btn_theme_switch").on("click", function() {
    if (localStorage.theme === 'dark') {
        setLightTheme(); // Switch to light theme if currently dark
    } else {
        setDarkTheme(); // Switch to dark theme if currently light
    }
});