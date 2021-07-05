Selector & Combinator :

- Selector - used to select a set of elements :
  - _{}, p{}, .class_name{}, #id_name{}, [data_type (_$|)= ""]
  - compund selected, tag.class, specifies a tag "a" that has a class label "b".
- Combinator - used to fine grain selection, works between 2 selectors :
  - Descendent Combinator : Recursive, applies subsequence matching to apply properties (Read MDN)
  - Next Sibling : Targets only 2nd children if not used with universal selector, Recursive otherwise
  - Subsequent Sibling : Targets all of the children compared to Next Sibling.
  - Child Combinator : Used to specify immediate children only, to remove recursive changes.
