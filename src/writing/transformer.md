---
title: Theory vs. Practice - Transformers
date: 2025-12-08
---

Transformers are highly relevant to modern machine learning, but most explanations focus on the original architecture (Attention Is All You Need), without detailing the differences that arise in modern implementations.

![transformer](https://miro.medium.com/v2/resize:fit:1400/1*BHzGVskWGS_3jEcYYi6miQ.png){align=left width=210}Encoder: Turns sequence to representation using full attention

Decoder: Autoregressively builds sequence w/ attention to full encoded input, and outputs representation so far

So what if we only took pieces of this architecture?
Left side: Encoder
Right side: Decoder

Full Architecture: (Google Translate)
- Uses the encoded input to autoregressively generate an output, considering all previous outputs when generating the new one
- eg. Translating from English to German. Looks at the whole English sequence and the German generated so far

Encoder-only: (Bert)
- Don't want an autoregressive output sequence
- eg. Embeds input, runs through MLP, last layer converts latent to sentiment value

Decoder-only: (LLMs)
- Only want the autoregressive output sequence, attending to the previously generated token, but no static input
- eg. Looks at the previous tokens, runs this context through an MLP, comes up with an next-token prediction
