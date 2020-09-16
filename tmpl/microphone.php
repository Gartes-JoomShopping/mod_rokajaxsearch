<style>

</style>
<svg style="display: none;">
    <defs id="symbols">
        <symbol viewBox="0 0 14 19" id="icon-microphone">
            <path d="m7 12c1.66 0 2.99-1.34 2.99-3l.01-6c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1s-5.3-2.1-5.3-5.1h-1.7c0 3.41 2.72 6.23 6 6.72v3.28h2v-3.28c3.28-.48 6-3.3 6-6.72z"></path>
        </symbol>
    </defs>
</svg>
<button class="search-form__microphone speechRecognition" type="button" aria-label="Голосовой поиск">
    <svg height="19" width="14">
        <use _ngcontent-c8="" xlink:href="#icon-microphone" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
    </svg>
</button>
<div id="info" >
    <p id="info_start">Нажмите на значок микрофона для поиска голосом.</p>
    <p id="info_speak_now" style="display:none">Говорите сейчас.</p>
    <p id="info_no_speech" style="display:none">
        No speech was detected. You may need to adjust your <a
            href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.
    </p>
    <p id="info_no_microphone" style="display:none">
        No microphone was found. Ensure that a microphone is installed and that
        <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">
            microphone settings</a> are configured correctly.
    </p>
    <p id="info_allow" style="display:none">
        Click the "Allow" button above to enable your microphone.
    </p>
    <p id="info_denied" style="display:none">
        Permission to use microphone was denied.
    </p>
    <p id="info_blocked" style="display:none">
        Permission to use microphone is blocked. To change, go to
        chrome://settings/contentExceptions#media-stream
    </p>
    <p id="info_upgrade" style="display:none">
        Web Speech API is not supported by this browser. Upgrade to <a href=
                                                                               "//www.google.com/chrome">Chrome</a> version 25 or later.
    </p>
</div>
<!-- see view-source:https://www.google.com/intl/en/chrome/demos/speech.html -->



