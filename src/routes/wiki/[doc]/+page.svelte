<script>
    import { page } from '$app/stores';
    import DOMPurify from 'isomorphic-dompurify';
    const doc = $page.params.doc
    const content = "<asdf>hello</asdf> <p>world</p>"
</script>

{doc} 문서입니다.<br />
아직 작성되지 않은 문서입니다.
작성하러가기<br />
{content}<br/>
{@html DOMPurify.sanitize(content)}
