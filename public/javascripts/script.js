// Allows for auto expanding textareas
function makeExpandingArea(container) {
    var area = container.querySelector('textarea'),
        span = container.querySelector('span');

    if (!area) {
        return;
    }

    if (area.addEventListener) {
        area.addEventListener('input', function () {
            span.textContent = area.value;
        }, false);
        span.textContent = area.value;
    } else if (area.attachEvent) {
        // IE8 compatibility
        area.attachEvent('onpropertychange', function () {
            span.innerText = area.value;
        });
        span.innerText = area.value;
    }

    // Enable extra CSS
    container.className += ' active';
}

// Lets us get the caret position in textarea
function getCaret(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {
        el.focus();

        var r = document.selection.createRange();
        if (r == null) {
            return 0;
        }

        var re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);

        return rc.text.length;
    }
    return 0;
}

$(function () {
    // Auto-expanding height for editor textareas
    var title = document.getElementById('text-title'),
        content = document.getElementById('text-content');

    // If we're on the edit page
    if (title) {
        // Auto expanding textareas.  See _functions.js
        makeExpandingArea(title);
        makeExpandingArea(content);

        // Scroll window if we edit long posts
        $('#post_content').bind('keyup', function () {
            var $this = $(this),
                bottom = $this.offset().top + $this.height();

            if (bottom > $(window).scrollTop() && $this.prop("selectionStart") > ($this.val().length - $this.val().split('\n').slice(-1)[0].length)) {
                $(window).scrollTop(bottom);
            }
        });

        // Set minimum height of content textarea
        $('#post_content').css('min-height', $(window).height() - $('#post_title').height() - 130);

        // Autosave
        // setInterval(function(){
        //   var form = $('.edit_post'),
        //       action = form.attr('action');
        //   $.post(action, form.serialize(), function(data){
        //   	$('body').prepend('<span>Saved!</span>');
        //   });
        // },10000);
        // Preview pops open new window
        var form = document.getElementsByTagName('form')[0];
        // document.getElementById('preview-button').onclick = function () {
        //     form.target = '_blank';
        // }
        document.getElementById('save-button').onclick = function () {
            form.target = '_self';
        }

        // Fade out save post notice
        $('.notice').delay(2000).fadeOut(500);
    }
});
