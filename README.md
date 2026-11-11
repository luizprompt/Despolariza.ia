Projeto desenvolvido como protótipo académico para o curso de Análise e Desenvolvimento de Sistemas (FATEC Zona Sul).

 Despolariza.ia

**Despolariza.ia** é uma aplicação mobile desenvolvida em React Native (Expo) que utiliza Inteligência Artificial Multimodal (API do Google Gemini) para combater a desinformação, o alarmismo e a polarização política em conteúdos partilhados nas redes sociais.
O objetivo do projeto é promover a literacia mediática, permitindo que os utilizadores submetam textos, áudios ou capturas de ecrã (prints) de correntes do WhatsApp e notícias, recebendo em segundos uma análise imparcial sobre o nível de viés, veracidade e hostilidade do conteúdo.

## Funcionalidades

* **Análise Multimodal:** Suporte para análise de textos copiados, imagens (prints de notícias/memes) e ficheiros de áudio.
* **Classificação de Risco (Score de Viés):** O motor de IA avalia o conteúdo e retorna uma classificação semântica com código de cores:
  * 🟢 **VERDE:** Conteúdo factual, neutro e baseado em dados.
  * 🟡 **AMARELO:** Conteúdo com viés elevado, ataques pessoais (Ad Hominem) ou alarmismo.
  * 🔴 **VERMELHO:** Desinformação grave, fake news ou promessas sem base científica.
* **Furar a Bolha:** O sistema recomenda 3 termos de pesquisa neutros e oficiais para que o utilizador procure a verdade fora do viés algorítmico.
* **Motor de Contingência (Fallback):** Arquitetura resiliente com um algoritmo local de processamento de linguagem natural (NLP) baseado em palavras-chave que assume a análise caso a API externa falhe ou não haja ligação à internet.
* **Partilha Direta:** Geração de um "Card de Verificação" formatado para ser partilhado diretamente no WhatsApp.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React Native, Expo, JavaScript
* **Integração de IA:** Google Gemini API (`gemini-2.5-flash`)
* **Módulos Nativos:** `expo-image-picker` (Galeria), `expo-document-picker` (Ficheiros), `Share` (Partilha nativa)
* **Arquitetura:** Single Page Application com gestão de estados dinâmicos (Hooks) e proteção de variáveis de ambiente.

## 💡 Como executar localmente

1. Clone este repositório:
   ```bash
   git clone [https://github.com/luizprompt/Despolariza.ia.git](https://github.com/luizprompt/Despolariza.ia.git)
