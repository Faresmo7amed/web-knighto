import localFont from 'next/font/local'

// Local Anthropic fonts keep builds independent from the Google Fonts network service.
export const anthropicSans = localFont({
    src: [
        { path: '../../Anthropic/anthropic-sans/AnthropicSans-Text-Regular-Static.otf', weight: '400', style: 'normal' },
        { path: '../../Anthropic/anthropic-sans/AnthropicSans-Text-Medium-Static.otf', weight: '500', style: 'normal' },
        { path: '../../Anthropic/anthropic-sans/AnthropicSans-Text-Semibold-Static.otf', weight: '600', style: 'normal' },
        { path: '../../Anthropic/anthropic-sans/AnthropicSans-Text-Bold-Static.otf', weight: '700', style: 'normal' },
    ],
    variable: '--font-anthropic-sans',
    display: 'swap',
    adjustFontFallback: 'Arial',
})

// Article prose uses the locally hosted Anthropic serif family.
export const anthropicSerif = localFont({
    src: [
        { path: '../../Anthropic/anthropic-serif/AnthropicSerif-Text-Regular-Static.otf', weight: '400', style: 'normal' },
        { path: '../../Anthropic/anthropic-serif/AnthropicSerif-Text-Medium-Static.otf', weight: '500', style: 'normal' },
        { path: '../../Anthropic/anthropic-serif/AnthropicSerif-Text-Semibold-Static.otf', weight: '600', style: 'normal' },
        { path: '../../Anthropic/anthropic-serif/AnthropicSerif-Text-Bold-Static.otf', weight: '700', style: 'normal' },
        { path: '../../Anthropic/anthropic-serif/AnthropicSerif-Text-RegularItalic-Static.otf', weight: '400', style: 'italic' },
    ],
    variable: '--font-anthropic-serif',
    display: 'swap',
    adjustFontFallback: 'Times New Roman',
})

// Code uses the supplied mono web face.
export const anthropicMono = localFont({
    src: '../../Anthropic/anthropic-mono/Anthropic Mono Web.otf',
    variable: '--font-anthropic-mono',
    display: 'swap',
    adjustFontFallback: false,
})

// All font variables as one class string, applied on <html>.
export const fontVariables = [anthropicSans.variable, anthropicSerif.variable, anthropicMono.variable].join(' ')
