<script setup>
import CounterButton from '$dev/components/CounterButton.vue'
</script>

# Markdown

This page is written in _Markdown_.

## Vue components

Interactive components can be included in the Markdown. <CounterButton/>

## Code

```js {1,3-4}
const x = 1;

for (let i = 0; i < x; i += 1) {
  console.log(1); // [!code focus:<lines>]
}
```

## Table

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## Alerts

> [!note]
> This is an note.

> [!important]
> This is important.

> [!tip]
> This is a tip.

> [!warning]
> This is a warning.

> [!caution]
> This is a dangerous warning.

> [!details]
> This is a details block.

## Snippets

<<< #pages/markdown/+Page.md
