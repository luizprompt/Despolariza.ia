import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, ActivityIndicator, Image, Share, Alert, StatusBar 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { analisarMidiaWhatsApp } from './components/src/gemini';

export default function App() {
  const [etapa, setEtapa] = useState('HOME');
  const [texto, setTexto] = useState('');
  const [midia, setMidia] = useState(null);
  const [resultado, setResultado] = useState(null);

  const HeaderIdentidade = () => (
    <View style={styles.headerContainer}>
      <View style={styles.pillBadge}>
        <Text style={styles.pillText}>⚡ IA MULTIMODAL CONTRA A DESINFORMAÇÃO</Text>
      </View>
      <Text style={styles.logoText}>
        Despolariza<Text style={styles.logoAccent}>.ia</Text>
      </Text>
      <Text style={styles.sloganText}>
        Enxergue além da bolha: análise crítica de fatos e viés em segundos.
      </Text>
    </View>
  );

  const escolherImagem = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permissão necessária", "Libere o acesso à galeria para anexar prints.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      const asset = res.assets[0];
      setMidia({
        uri: asset.uri,
        mimeType: asset.mimeType || 'image/jpeg',
        nome: 'Print_Analise.jpg',
        tipo: 'IMAGEM'
      });
    }
  };

  const escolherAudio = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });

    if (!res.canceled) {
      const asset = res.assets[0];
      setMidia({
        uri: asset.uri,
        mimeType: asset.mimeType || 'audio/ogg',
        nome: asset.name,
        tipo: 'AUDIO'
      });
    }
  };

  const iniciarAnalise = async () => {
    if (!texto.trim() && !midia) {
      Alert.alert("Atenção", "Cole uma mensagem, anexe um print ou selecione um áudio primeiro!");
      return;
    }

    setEtapa('LOADING');
    try {
      const dados = await analisarMidiaWhatsApp({
        texto: texto,
        uriArquivo: midia?.uri,
        mimeType: midia?.mimeType
      });
      setResultado(dados);
      setEtapa('RESULTADO');
    } catch (err) {
      Alert.alert("Erro na Análise", err.message || "Falha ao consultar a IA.");
      setEtapa('HOME');
    }
  };

  const compartilharNoZap = async () => {
    if (!resultado) return;
    const emoji = resultado.classificacao === 'VERDE' ? '🟢' : resultado.classificacao === 'AMARELO' ? '🟡' : '🔴';
    const msg = `${emoji} *DESPOLARIZA.IA - CHECAGEM E ANÁLISE DE VIÉS*\n\n*Tema:* ${resultado.titulo_curto}\n*Grau de Polarização/Risco:* ${resultado.score_risco}%\n\n*Análise Imparcial:*\n${resultado.resumo_fatos}\n\n🔎 *Fure a bolha pesquisando:* ${resultado.fontes_recomendadas.join(', ')}`;
    
    await Share.share({ message: msg });
  };

  const novaConsulta = () => {
    setTexto('');
    setMidia(null);
    setResultado(null);
    setEtapa('HOME');
  };

  if (etapa === 'LOADING') {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <ActivityIndicator size="large" color="#00E676" />
        <Text style={styles.loadingTitle}>Despolarizando conteúdo...</Text>
        <Text style={styles.loadingSub}>
          O motor Gemini está a processar padrões de mídia e viés de linguagem.
        </Text>
      </View>
    );
  }

  if (etapa === 'RESULTADO' && resultado) {
    const corDestaque = 
      resultado.classificacao === 'VERDE' ? '#00E676' : 
      resultado.classificacao === 'AMARELO' ? '#FFD600' : '#FF3D00';

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <HeaderIdentidade />

        <View style={[styles.resultCard, { borderColor: corDestaque }]}>
          <View style={[styles.badgeStatus, { backgroundColor: corDestaque }]}>
            <Text style={styles.badgeText}>
              {resultado.classificacao} • ÍNDICE DE VIÉS/RISCO: {resultado.score_risco}%
            </Text>
          </View>

          <Text style={styles.cardTitle}>{resultado.titulo_curto}</Text>
          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>⚖️ SÍNTESE DESPOLARIZADA:</Text>
          <Text style={styles.fatosText}>{resultado.resumo_fatos}</Text>

          <Text style={styles.sectionLabel}>🌐 TERMOS PARA FURAR A BOLHA:</Text>
          {resultado.fontes_recomendadas?.map((item, idx) => (
            <View key={idx} style={styles.topicChip}>
              <Text style={styles.topicText}>• {item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={compartilharNoZap}>
          <Text style={styles.shareBtnText}>📲 Compartilhar Card no WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={novaConsulta}>
          <Text style={styles.resetBtnText}>Analisar nova mídia ou texto</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <HeaderIdentidade />

      <View style={styles.mediaButtonsRow}>
        <TouchableOpacity style={styles.mediaBtn} onPress={escolherImagem}>
          <Text style={styles.mediaEmoji}>🖼️</Text>
          <Text style={styles.mediaBtnTitle}>Anexar Print</Text>
          <Text style={styles.mediaBtnSub}>Notícia ou Meme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaBtn} onPress={escolherAudio}>
          <Text style={styles.mediaEmoji}>🎙️</Text>
          <Text style={styles.mediaBtnTitle}>Anexar Áudio</Text>
          <Text style={styles.mediaBtnSub}>Áudio (.ogg/.mp3)</Text>
        </TouchableOpacity>
      </View>

      {midia && (
        <View style={styles.attachmentBox}>
          {midia.tipo === 'IMAGEM' ? (
            <Image source={{ uri: midia.uri }} style={styles.previewImg} />
          ) : (
            <Text style={styles.audioIcon}>🎵</Text>
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.attachName}>{midia.nome}</Text>
            <Text style={styles.attachType}>{midia.tipo} anexado para verificação</Text>
          </View>
          <TouchableOpacity onPress={() => setMidia(null)}>
            <Text style={styles.removeBtn}>✖</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.inputLabel}>Ou cole uma corrente / manchete polarizada:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Cole aqui o texto recebido ou o trecho da notícia..."
        placeholderTextColor="#64748B"
        multiline
        numberOfLines={4}
        value={texto}
        onChangeText={setTexto}
      />

      <TouchableOpacity style={styles.analyzeBtn} onPress={iniciarAnalise}>
        <Text style={styles.analyzeBtnText}>⚡ Despolarizar com IA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0F172A', padding: 24, paddingTop: 50 },
  centerContainer: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 30 },
  headerContainer: { alignItems: 'center', marginBottom: 28 },
  pillBadge: { backgroundColor: 'rgba(0, 230, 118, 0.12)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0, 230, 118, 0.4)', marginBottom: 10 },
  pillText: { color: '#00E676', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.8 },
  logoText: { fontSize: 32, fontWeight: '900', color: '#F8FAFC', letterSpacing: -0.5 },
  logoAccent: { color: '#00E676' },
  sloganText: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 6, lineHeight: 19, paddingHorizontal: 10 },
  mediaButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  mediaBtn: { backgroundColor: '#1E293B', width: '48%', padding: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  mediaEmoji: { fontSize: 30, marginBottom: 8 },
  mediaBtnTitle: { color: '#F8FAFC', fontWeight: 'bold', fontSize: 15 },
  mediaBtnSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  attachmentBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064E3B', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#00E676' },
  previewImg: { width: 48, height: 48, borderRadius: 8 },
  audioIcon: { fontSize: 32 },
  attachName: { color: '#F8FAFC', fontWeight: 'bold', fontSize: 14 },
  attachType: { color: '#6EE7B7', fontSize: 12 },
  removeBtn: { color: '#FCA5A5', fontSize: 18, fontWeight: 'bold', padding: 6 },
  inputLabel: { color: '#CBD5E1', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  textInput: { backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: 12, padding: 14, minHeight: 110, textAlignVertical: 'top', borderWidth: 1, borderColor: '#334155', marginBottom: 24 },
  analyzeBtn: { backgroundColor: '#00E676', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  analyzeBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  loadingTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  loadingSub: { color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  resultCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 22, borderWidth: 2, marginBottom: 24 },
  badgeStatus: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 14 },
  badgeText: { color: '#0F172A', fontWeight: '900', fontSize: 12 },
  cardTitle: { color: '#F8FAFC', fontSize: 21, fontWeight: 'bold', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  sectionLabel: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold', marginTop: 10, marginBottom: 6 },
  fatosText: { color: '#E2E8F0', fontSize: 15, lineHeight: 22, marginBottom: 12 },
  topicChip: { backgroundColor: '#0F172A', padding: 10, borderRadius: 8, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: '#00E676' },
  topicText: { color: '#E2E8F0', fontSize: 14, fontWeight: '500' },
  shareBtn: { backgroundColor: '#00E676', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  shareBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  resetBtn: { paddingVertical: 14, alignItems: 'center' },
  resetBtnText: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
});