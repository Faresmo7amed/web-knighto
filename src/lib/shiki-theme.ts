import type { ThemeRegistrationRaw } from 'shiki'

// Each role gets a unique placeholder color. Shiki puts the placeholder on tokens, then
// colorReplacements swaps it for a CSS variable from syntax.css. Keep the hex values lowercase.
const role = {
    keyword: { hex: '#aa0001', css: 'var(--syn-keyword)' },
    fn: { hex: '#aa0002', css: 'var(--syn-function)' },
    string: { hex: '#aa0003', css: 'var(--syn-string)' },
    punct: { hex: '#aa0004', css: 'var(--syn-punct)' },
    prop: { hex: '#aa0005', css: 'var(--syn-prop)' },
    tag: { hex: '#aa0006', css: 'var(--syn-tag)' },
    attr: { hex: '#aa0007', css: 'var(--syn-attr)' },
    comment: { hex: '#aa0008', css: 'var(--syn-comment)' },
    number: { hex: '#aa0009', css: 'var(--syn-number)' },
    decorator: { hex: '#aa000a', css: 'var(--syn-decorator)' },
    regex: { hex: '#aa000b', css: 'var(--syn-regex)' },
    accent: { hex: '#aa000c', css: 'var(--accent)' },
    success: { hex: '#aa000d', css: 'var(--success)' },
    danger: { hex: '#aa000e', css: 'var(--danger)' },
}

type Role = keyof typeof role
type Rule = [scopes: string[], role: Role, fontStyle?: string]

// TextMate scope -> role. When two scopes match, the more specific one wins
// (so 'support.type.property-name' beats 'support.type').
const rules: Rule[] = [
    [['keyword', 'keyword.control', 'keyword.other', 'storage', 'storage.type', 'storage.modifier', 'variable.language', 'keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python', 'keyword.other.special-method.dockerfile'], 'keyword'],
    [['entity.name.function', 'entity.name.class', 'entity.name.type', 'entity.name.namespace', 'entity.name.type.namespace', 'entity.other.inherited-class', 'entity.name.command', 'support.function', 'support.class', 'support.type', 'variable.function', 'markup.underline.link', 'string.other.link.title.markdown', 'string.other.link.description.markdown'], 'fn'],
    [['string', 'string.quoted', 'string.template', 'punctuation.definition.string'], 'string'],
    [['punctuation', 'keyword.operator', 'meta.brace', 'meta.template.expression', 'variable', 'variable.other', 'variable.parameter', 'variable.other.property', 'variable.other.object.property', 'meta.object-literal.key', 'support.variable.property', 'support.type.property-name', 'entity.name.tag.yaml'], 'punct'],
    [['constant.other.option'], 'prop'],
    [['entity.other.attribute-name.js', 'entity.other.attribute-name.jsx', 'entity.other.attribute-name.ts', 'entity.other.attribute-name.tsx'], 'prop'],
    [['entity.name.tag', 'entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css', 'entity.other.attribute-name.pseudo-class.css', 'entity.other.attribute-name.pseudo-element.css'], 'tag'],
    [['entity.other.attribute-name'], 'attr'],
    [['comment', 'punctuation.definition.comment', 'meta.diff.header'], 'comment', 'italic'],
    [['constant.numeric', 'constant.language', 'constant.character', 'support.constant', 'keyword.other.unit', 'constant.other.color'], 'number'],
    [['meta.decorator', 'entity.name.function.decorator', 'punctuation.decorator', 'storage.type.annotation', 'meta.preprocessor', 'keyword.control.directive', 'punctuation.definition.directive', 'entity.name.function.preprocessor'], 'decorator'],
    [['string.regexp', 'constant.character.escape', 'constant.other.character-class.regexp', 'keyword.operator.quantifier.regexp', 'meta.diff.range', 'variable.other.normal.shell', 'variable.other.bracket.shell', 'variable.other.positional.shell', 'variable.other.special.shell', 'punctuation.definition.variable.shell', 'variable.other.readwrite.powershell'], 'regex'],
    [['markup.heading', 'markup.heading.markdown', 'entity.name.section.markdown', 'punctuation.definition.heading.markdown'], 'accent'],
    [['markup.inserted'], 'success'],
    [['markup.deleted'], 'danger'],
]

export const siteTheme: ThemeRegistrationRaw = {
    name: 'site',
    type: 'dark',
    fg: role.punct.hex,
    bg: '#000000', // not used: the code block background comes from --code-bg
    colorReplacements: Object.fromEntries(Object.values(role).map((item) => [item.hex, item.css])),
    settings: [
        { settings: { foreground: role.punct.hex } },
        ...rules.map(([scope, name, fontStyle]) => ({
            scope,
            settings: { foreground: role[name].hex, ...(fontStyle ? { fontStyle } : {}) },
        })),
        { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
        { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    ],
}