# Acomici Common Directives

This repository includes most common Angular directives that are used in all other Acomici repositories. PR and issues are welcomed.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.3.

---
## Included Directives

- [acomiIsOutside](#acomiisoutside): Detect when user click outside the DOM
- [acomiCarousel](#acomicarousel): Simple carousel effect wrapper.
- [acomiOverCounted](#acomiovercounted): Simple over-counted number effect.
- [acomiDragNDrop](#acomidragndrop): drag and drop directive listener.

---
### `acomiIsOutside`

In your component's module.

```typescript
@NgModule({
  imports: [
    ClickOutsideModule
  ],
})
export class SomeModule {
}
```
And use in HTML component

```angular2html
<div acomiIsOutside (isOutside)="isClickingOutside($event)" (outside)="whenOutside()">
  Some DOM
</div>
```

```typescript
// your component.ts
/**
 * `isOutSide` will be true if user click outside the DOM.
 * and false when click inside the DOM (or any child DOM)
 * this is useful if you want to detect exactly when user click in or outside the DOM.
 */
isClickingOutside(isOutside: boolean) {
  // ...
}

/**
 * Use this if you only want to trigger when user click outside the DOM.
 */
whenOutside() {
  // ...
}
```
---
### `acomiCarousel`
In your component's module.

```typescript
@NgModule({
  imports: [
    CarouselModule
  ],
})
export class SomeModule {
}
```
- Updating...

---
### `acomiOverCounted`

In your component's module.

```typescript
@NgModule({
  imports: [
    OverCountedModule
  ],
})
export class SomeModule {
}
```
- Updating...

---
## Future document improvement:

Document for each directive will be constructed as some directive have lots of options ([acomiCarousel](#acomicarousel)).
