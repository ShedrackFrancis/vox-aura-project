import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Dimensions, Animated, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { Svg, Path, Circle, Line, Rect } from 'react-native-svg';

export default function App() {
  const [activeTab, setActiveTab] = useState('Live');
  const [wavePhase, setWavePhase] = useState(0);
  const systemScheme = useColorScheme();

  // Settings & Configuration States (Defaults to Light)
  const [themeMode, setThemeMode] = useState('Light');
  const [selectedVoice, setSelectedVoice] = useState('Neural Expressive Male');
  const [speakerVolume, setSpeakerVolume] = useState(75);
  const [sliderWidth, setSliderWidth] = useState(250);
  const [betaThreshold, setBetaThreshold] = useState(55);
  const [alphaThreshold, setAlphaThreshold] = useState(35);

  // Map Expansion State
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Interactive Chat State
  const [activeChatPeer, setActiveChatPeer] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [inputMessage, setInputMessage] = useState('');

  // AirPods-style Hardware Connection Popup State & Animation
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [headbandBattery, setHeadbandBattery] = useState(88);
  const slideAnim = useRef(new Animated.Value(150)).current;

  const triggerConnectionAnimation = (batteryLevel = 88) => {
    setHeadbandBattery(batteryLevel);
    setIsPopupVisible(true);
    
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();

    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 150,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setIsPopupVisible(false));
    }, 4000);
  };

  // Wave animation clock
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 0.25) % (Math.PI * 2));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const width = Dimensions.get('window').width - 48;
  const height = 70;

  const generateWavePath = (frequency, amplitude, phaseOffset) => {
    let pathD = `M 0 ${height / 2}`;
    for (let x = 0; x < width; x += 4) {
      const y = height / 2 + Math.sin(x * frequency + wavePhase + phaseOffset) * amplitude;
      pathD += ` L ${x} ${y}`;
    }
    return pathD;
  };

  // Resolve active theme based on mode, system setting, or 6am–6pm local time
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;

  const isLight =
    themeMode === 'Light' ||
    (themeMode === 'System' && systemScheme === 'light') ||
    (themeMode === 'Time Period' && isDaytime);

  const currentTheme = isLight ? lightStyles : darkStyles;

  // Handle sending a message in the interactive chat demo
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatPeer) return;

    const peerName = activeChatPeer.name;
    const userMsg = { sender: 'You', text: inputMessage, time: 'Just now' };

    setChatMessages(prev => ({
      ...prev,
      [peerName]: [...(prev[peerName] || [
        { sender: peerName, text: 'Neural telemetry link established. Ready for assisted stream.', time: '10:14 AM' }
      ]), userMsg]
    }));

    setInputMessage('');

    // Simulate automated intelligent reply from peer
    setTimeout(() => {
      const replyMsg = { sender: peerName, text: `Received your telemetry payload. Signal sync looks stable on my end.`, time: 'Just now' };
      setChatMessages(prev => ({
        ...prev,
        [peerName]: [...(prev[peerName] || []), replyMsg]
      }));
    }, 1200);
  };

  // --- SCREEN RENDERS ---

  const renderLive = () => (
    <View style={styles.scrollContent}>
      <View style={styles.systemOnlineBadge}>
        <View style={styles.statusDot} />
        <Text style={styles.systemOnlineText}>SYSTEM ONLINE</Text>
      </View>

      <Text style={[styles.screenTitle, currentTheme.textPrimary]}>Live Telemetry</Text>
      <Text style={[styles.screenSub, currentTheme.textSecondary]}>Real-time multi-channel neural stream analysis</Text>

      {/* Headband Physical Model Visual Integration */}
      <View style={[styles.hardwareModelContainer, currentTheme.card]}>
        <Svg height="100" width="200" viewBox="0 0 220 110">
          <Path
            d="M 20 55 Q 110 5 200 55 Q 110 105 20 55 Z"
            stroke="#34D399"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <Rect x="15" y="42" width="16" height="26" rx="4" fill="#1F2937" stroke="#38BDF8" strokeWidth="2" />
          <Rect x="189" y="42" width="16" height="26" rx="4" fill="#1F2937" stroke="#38BDF8" strokeWidth="2" />
          <Path d="M 15 55 Q 5 65 2 80" stroke="#9CA3AF" strokeWidth="3" fill="none" />
          <Path d="M 205 55 Q 215 65 218 80" stroke="#9CA3AF" strokeWidth="3" fill="none" />
        </Svg>
        <Text style={styles.modelStatusText}>HEADBAND MODEL: SYNCHRONIZED</Text>
      </View>

      {/* Hardware Status Indicators Bar */}
      <View style={styles.statusGrid}>
        <View style={[styles.statusBox, currentTheme.card]}>
          <Text style={[styles.statusBoxLabel, currentTheme.textSecondary]}>Headband</Text>
          <Text style={styles.statusBoxValueGreen}>CONNECTED</Text>
        </View>
        <View style={[styles.statusBox, currentTheme.card]}>
          <Text style={[styles.statusBoxLabel, currentTheme.textSecondary]}>Azure AI</Text>
          <Text style={styles.statusBoxValueBlue}>ACTIVE</Text>
        </View>
        <View style={[styles.statusBox, currentTheme.card]}>
          <Text style={[styles.statusBoxLabel, currentTheme.textSecondary]}>Signal</Text>
          <Text style={styles.statusBoxValueGreen}>EXCELLENT</Text>
        </View>
      </View>

      <View style={[styles.stateBanner, currentTheme.card]}>
        <View style={styles.stateOkBadge}><Text style={styles.okText}>OK</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.stateTitle, currentTheme.textPrimary]}>Baseline / Neutral</Text>
          <Text style={[styles.stateSub, currentTheme.textSecondary]}>Stable State — No Immediate Intervention Required</Text>
        </View>
      </View>

      <View style={[styles.card, currentTheme.card]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, currentTheme.textPrimary]}>Alpha Band <Text style={styles.subTag}>[Calmness]</Text></Text>
          <Text style={styles.metricAlpha}>30.1 µV</Text>
        </View>
        <View style={[styles.chartContainer, currentTheme.chartBg]}>
          <Svg height={height} width={width}>
            <Path d={generateWavePath(0.04, 20, 0)} stroke="#10B981" strokeWidth="2" fill="none" />
          </Svg>
        </View>
      </View>

      <View style={[styles.card, currentTheme.card]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, currentTheme.textPrimary]}>Beta Band <Text style={styles.subTag}>[Focus / Intent]</Text></Text>
          <Text style={styles.metricBeta}>44.3 µV</Text>
        </View>
        <View style={[styles.chartContainer, currentTheme.chartBg]}>
          <Svg height={height} width={width}>
            <Path d={generateWavePath(0.08, 25, 1.5)} stroke="#EF4444" strokeWidth="2" fill="none" />
          </Svg>
        </View>
      </View>

      <View style={[styles.card, currentTheme.card]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, currentTheme.textPrimary]}>Theta Band <Text style={styles.subTag}>[Rest / Low Energy]</Text></Text>
          <Text style={styles.metricTheta}>6.3 µV</Text>
        </View>
        <View style={[styles.chartContainer, currentTheme.chartBg]}>
          <Svg height={height} width={width}>
            <Path d={generateWavePath(0.03, 15, 2.5)} stroke="#F59E0B" strokeWidth="2" fill="none" />
          </Svg>
        </View>
      </View>
    </View>
  );

  const renderLogs = () => (
    <View style={styles.scrollContent}>
      <Text style={[styles.screenTitle, currentTheme.textPrimary]}>Communication Logs</Text>
      <Text style={[styles.screenSub, currentTheme.textSecondary]}>Historical communication events & emotional states</Text>

      <View style={styles.logsMetricRow}>
        <View style={[styles.logBox, currentTheme.card]}>
          <Text style={styles.logNumGreen}>6</Text>
          <Text style={[styles.logLabel, currentTheme.textSecondary]}>Today</Text>
        </View>
        <View style={[styles.logBox, currentTheme.card]}>
          <Text style={styles.logNumBlue}>42</Text>
          <Text style={[styles.logLabel, currentTheme.textSecondary]}>This Week</Text>
        </View>
        <View style={[styles.logBox, currentTheme.card]}>
          <Text style={styles.logNumRed}>8</Text>
          <Text style={[styles.logLabel, currentTheme.textSecondary]}>High Urgency</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>RECENT TELEMETRY EVENTS</Text>

      <View style={[styles.eventCard, currentTheme.card]}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, currentTheme.textPrimary]}>High Attention — Attempting Communication</Text>
          <Text style={styles.badgeHigh}>HIGH</Text>
        </View>
        <Text style={[styles.eventSub, currentTheme.textSecondary]}>Beta channel threshold exceeded · 07:45 PM</Text>
      </View>

      <View style={[styles.eventCard, currentTheme.card]}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, currentTheme.textPrimary]}>Peaceful State — Comfort Baseline</Text>
          <Text style={styles.badgeLow}>LOW</Text>
        </View>
        <Text style={[styles.eventSub, currentTheme.textSecondary]}>Alpha dominant band · 07:12 PM</Text>
      </View>
    </View>
  );

  const renderCommunity = () => {
    // If a peer is selected, render the interactive chat view
    if (activeChatPeer) {
      const messages = chatMessages[activeChatPeer.name] || [
        { sender: activeChatPeer.name, text: 'Neural telemetry link established. Ready for assisted stream.', time: '10:14 AM' }
      ];

      return (
        <View style={styles.scrollContent}>
          <View style={styles.chatHeaderBar}>
            <TouchableOpacity onPress={() => setActiveChatPeer(null)} style={styles.backButton}>
              <Text style={styles.backButtonText}>← BACK TO COMMUNITY</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.chatPeerProfileBanner, currentTheme.card]}>
            <View style={[styles.avatarCircleLarge, currentTheme.avatarBg]}>
              <Text style={[styles.avatarTextLarge, currentTheme.textPrimary]}>{activeChatPeer.name[0]}</Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.screenTitle, { fontSize: 20 }, currentTheme.textPrimary]}>{activeChatPeer.name}</Text>
              <Text style={[styles.screenSub, { marginBottom: 0 }, currentTheme.textSecondary]}>{activeChatPeer.loc} · {activeChatPeer.status}</Text>
            </View>
          </View>

          <Text style={styles.sectionHeader}>SECURE TELEMETRY CHAT STREAM</Text>

          {messages.map((msg, idx) => {
            const isMe = msg.sender === 'You';
            return (
              <View key={idx} style={[styles.chatBubbleContainer, isMe ? styles.chatBubbleRight : styles.chatBubbleLeft]}>
                <View style={[styles.chatBubble, isMe ? styles.bubbleMe : currentTheme.card]}>
                  {!isMe && <Text style={styles.bubbleSender}>{msg.sender}</Text>}
                  <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : currentTheme.textPrimary]}>{msg.text}</Text>
                  <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : currentTheme.textSecondary]}>{msg.time}</Text>
                </View>
              </View>
            );
          })}

          <View style={[styles.chatInputContainer, currentTheme.card]}>
            <TextInput
              style={[styles.chatTextInput, currentTheme.textPrimary]}
              placeholder="Type message or broadcast intent..."
              placeholderTextColor="#6B7280"
              value={inputMessage}
              onChangeText={setInputMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>SEND</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Default Community Tab View with Clickable Profiles
    return (
      <View style={styles.scrollContent}>
        <Text style={[styles.screenTitle, currentTheme.textPrimary]}>Community Network</Text>
        <Text style={[styles.screenSub, currentTheme.textSecondary]}>Tap any peer below to open live secure communication</Text>

        <TouchableOpacity 
          style={[styles.mapContainer, currentTheme.card]} 
          onPress={() => setIsMapExpanded(!isMapExpanded)}
          activeOpacity={0.9}
        >
          <View style={[styles.mapHeader, currentTheme.mapHeaderBg]}>
            <Text style={styles.mapHeaderText}>LIVE USER MAP — 4 NEARBY NODES [TAP TO {isMapExpanded ? 'MINIMIZE' : 'EXPAND'}]</Text>
            <View style={styles.mapPulseDot} />
          </View>
          <View style={[styles.radarScreen, currentTheme.chartBg, { height: isMapExpanded ? 240 : 140 }]}>
            <Svg height={isMapExpanded ? 240 : 140} width={width} style={{ position: 'absolute' }}>
              <Circle cx={width / 2} cy={isMapExpanded ? 120 : 70} r="35" stroke="#1E3A8A" strokeWidth="1" fill="none" />
              <Circle cx={width / 2} cy={isMapExpanded ? 120 : 70} r="70" stroke="#1E3A8A" strokeWidth="1" fill="none" />
              <Circle cx={width / 2} cy={isMapExpanded ? 120 : 70} r="105" stroke="#1E3A8A" strokeWidth="1" fill="none" />
              <Line x1="0" y1={isMapExpanded ? 120 : 70} x2={width} y2={isMapExpanded ? 120 : 70} stroke="#1F2937" strokeWidth="1" />
              <Line x1={width / 2} y1="0" x2={width / 2} y2={isMapExpanded ? 240 : 140} stroke="#1F2937" strokeWidth="1" />
            </Svg>
            <View style={[styles.radarNode, { top: isMapExpanded ? 60 : 35, left: width * 0.3 }]} />
            <View style={[styles.radarNodeActive, { top: isMapExpanded ? 150 : 85, left: width * 0.65 }]} />
            <View style={[styles.radarNode, { top: isMapExpanded ? 180 : 100, left: width * 0.4 }]} />
            <Text style={styles.radarCaption}>Interactive Telemetry Proximity Grid ({isMapExpanded ? 'Expanded Mode' : 'Standard View'})</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.logsMetricRow}>
          <View style={[styles.logBox, currentTheme.card]}>
            <Text style={styles.logNumGreen}>4</Text>
            <Text style={[styles.logLabel, currentTheme.textSecondary]}>Online</Text>
          </View>
          <View style={[styles.logBox, currentTheme.card]}>
            <Text style={styles.logNumYellow}>3</Text>
            <Text style={[styles.logLabel, currentTheme.textSecondary]}>Nearby</Text>
          </View>
          <View style={[styles.logBox, currentTheme.card]}>
            <Text style={styles.logNumBlue}>2.4k</Text>
            <Text style={[styles.logLabel, currentTheme.textSecondary]}>Global</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>CLICK PEER PROFILE TO CHAT</Text>

        {[
          { name: 'Alex Mercer', loc: 'San Francisco, US · 2.3 km', status: 'Online', tag: 'green' },
          { name: 'Tuan Nguyen', loc: 'Hanoi, Vietnam · 11.4 km', status: 'In Call', tag: 'blue' },
          { name: 'Sofia Reyes', loc: 'Madrid, Spain · 4.1 km', status: 'Online', tag: 'green' },
          { name: 'Amara Okafor', loc: 'Lagos, Nigeria', status: 'Online', tag: 'green' },
        ].map((user, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.peerCard, currentTheme.card]}
            onPress={() => setActiveChatPeer(user)}
          >
            <View style={[styles.avatarCircle, currentTheme.avatarBg]}><Text style={[styles.avatarText, currentTheme.textPrimary]}>{user.name[0]}</Text></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.peerName, currentTheme.textPrimary]}>{user.name}</Text>
              <Text style={[styles.peerLoc, currentTheme.textSecondary]}>{user.loc}</Text>
            </View>
            <View style={[styles.statusPill, user.tag === 'green' ? styles.pillGreen : styles.pillBlue]}>
              <Text style={styles.pillText}>CHAT →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSettings = () => (
    <View style={styles.scrollContent}>
      <Text style={[styles.screenTitle, currentTheme.textPrimary]}>Settings & Calibration</Text>
      <Text style={[styles.screenSub, currentTheme.textSecondary]}>Voice synthesis profiles, appearance, fluid volume & thresholds</Text>

      <Text style={styles.sectionHeader}>HARDWARE SIMULATION TESTING</Text>
      <View style={[styles.settingCard, currentTheme.card]}>
        <Text style={[styles.settingParam, currentTheme.textSecondary, { marginBottom: 12 }]}>
          Test the bottom slide-in pairing animation for the EEG Headband before physical assembly.
        </Text>
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => triggerConnectionAnimation(88)}
        >
          <Text style={styles.testButtonText}>Simulate Headband Connection</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>APPEARANCE</Text>
      <View style={[styles.settingCard, currentTheme.card]}>
        {['Light', 'Dark', 'System', 'Time Period'].map((mode) => (
          <TouchableOpacity 
            key={mode}
            style={[styles.profileOption, currentTheme.subCard, themeMode === mode && styles.profileOptionActive]}
            onPress={() => setThemeMode(mode)}
          >
            <Text style={[styles.profileText, currentTheme.textSecondary, themeMode === mode && styles.profileTextActive]}>
              {mode === 'Light' ? 'Light (Always Light)' : mode === 'Dark' ? 'Dark (Always Dark)' : mode === 'System' ? 'System (Follows device)' : 'Time Period (6am - 6pm light)'}
            </Text>
            {themeMode === mode && <Text style={styles.activeCheck}>ACTIVE</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionHeader}>VOICE PROFILE</Text>
      <View style={[styles.settingCard, currentTheme.card]}>
        {[
          'Neural Expressive Male',
          'Neural Expressive Female',
          'Soft / Warm Tone'
        ].map((profile) => (
          <TouchableOpacity 
            key={profile}
            style={[styles.profileOption, currentTheme.subCard, selectedVoice === profile && styles.profileOptionActive]}
            onPress={() => setSelectedVoice(profile)}
          >
            <Text style={[styles.profileText, currentTheme.textSecondary, selectedVoice === profile && styles.profileTextActive]}>
              {profile}
            </Text>
            {selectedVoice === profile && <Text style={styles.activeCheck}>SELECTED</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionHeader}>VOLUME OUTPUT (FLUID SLIDER)</Text>
      <View style={[styles.settingCard, currentTheme.card]}>
        <View style={styles.thresholdRow}>
          <Text style={[styles.settingParam, currentTheme.textSecondary]}>Master Speaker Gain</Text>
          <Text style={styles.thresholdValue}>{speakerVolume}%</Text>
        </View>
        
        <View style={styles.sliderTrackContainer}>
          <View
            style={styles.sliderInteractiveArea}
            onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => {
              const ratio = Math.max(0, Math.min(1, e.nativeEvent.locationX / sliderWidth));
              setSpeakerVolume(Math.round(ratio * 100));
            }}
            onResponderMove={(e) => {
              const ratio = Math.max(0, Math.min(1, e.nativeEvent.locationX / sliderWidth));
              setSpeakerVolume(Math.round(ratio * 100));
            }}
          >
            <View style={styles.sliderTrackBase} pointerEvents="none">
              <View style={[styles.sliderTrackFill, { width: `${speakerVolume}%` }]} />
              <View style={[styles.sliderThumb, { left: `${speakerVolume}%` }]} />
            </View>
          </View>
        </View>
        
        <View style={styles.sliderMarks}>
          <Text style={styles.markText}>0%</Text>
          <Text style={styles.markText}>50%</Text>
          <Text style={styles.markText}>100%</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>EEG SENSOR CALIBRATION</Text>
      <View style={[styles.settingCard, currentTheme.card]}>
        <View style={styles.thresholdRow}>
          <Text style={[styles.settingParam, currentTheme.textSecondary]}>Beta Trigger Threshold</Text>
          <Text style={styles.thresholdValue}>{betaThreshold} µV</Text>
        </View>
        <View style={styles.thresholdRowLast}>
          <Text style={[styles.settingParam, currentTheme.textSecondary]}>Alpha Relaxation Band</Text>
          <Text style={styles.thresholdValue}>{alphaThreshold} µV</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, currentTheme.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'Live' && renderLive()}
        {activeTab === 'Logs' && renderLogs()}
        {activeTab === 'Community' && renderCommunity()}
        {activeTab === 'Settings' && renderSettings()}
      </ScrollView>

      {/* AirPods-style Bottom-Up Slide Animation Card */}
      {isPopupVisible && (
        <Animated.View style={[styles.popupContainer, currentTheme.card, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.popupInner}>
            <View style={styles.popupDeviceGraphic}>
              <Text style={styles.popupGraphicText}>VOX</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.popupTitle, currentTheme.textPrimary]}>VOX Neural Headband</Text>
              <Text style={styles.popupSub}>Connected · BLE 5.2</Text>
            </View>
            <View style={styles.batteryBadge}>
              <Text style={styles.batteryText}>{headbandBattery}%</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Navigation Bar */}
      <View style={[styles.navBar, currentTheme.navBar]}>
        {[
          { key: 'Live', label: 'Telemetry' },
          { key: 'Logs', label: 'Logs' },
          { key: 'Community', label: 'Community' },
          { key: 'Settings', label: 'Settings' }
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.key} 
            style={styles.navItem} 
            onPress={() => { setActiveChatPeer(null); setActiveTab(tab.key); }}
          >
            <Text style={[styles.navLabel, activeTab === tab.key && styles.activeNavLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#05070B' },
  card: { backgroundColor: '#0B0F17', borderColor: '#1F2937' },
  subCard: { backgroundColor: '#030508', borderColor: '#1F2937' },
  chartBg: { backgroundColor: '#030508' },
  mapHeaderBg: { backgroundColor: '#111827' },
  avatarBg: { backgroundColor: '#1F2937' },
  textPrimary: { color: '#FFFFFF' },
  textSecondary: { color: '#9CA3AF' },
  navBar: { backgroundColor: '#05070B', borderTopColor: '#1F2937' }
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6' },
  card: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  subCard: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  chartBg: { backgroundColor: '#F8FAFC' },
  mapHeaderBg: { backgroundColor: '#E5E7EB' },
  avatarBg: { backgroundColor: '#E5E7EB' },
  textPrimary: { color: '#111827' },
  textSecondary: { color: '#4B5563' },
  navBar: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB' }
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingTop: 50, paddingBottom: 180 },
  scrollContent: { width: '100%' },
  systemOnlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064E3B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 12, borderWidth: 1, borderColor: '#047857' },
  statusDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#34D399', marginRight: 6 },
  systemOnlineText: { color: '#34D399', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  screenTitle: { fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
  screenSub: { fontSize: 12, marginBottom: 16 },
  hardwareModelContainer: { alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  modelStatusText: { fontSize: 9, fontWeight: '700', color: '#38BDF8', marginTop: 6, letterSpacing: 1 },
  statusGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statusBox: { flex: 1, padding: 10, borderRadius: 10, marginHorizontal: 3, alignItems: 'center', borderWidth: 1 },
  statusBoxLabel: { fontSize: 9, marginBottom: 3, textTransform: 'uppercase' },
  statusBoxValueGreen: { fontSize: 10, fontWeight: '700', color: '#34D399' },
  statusBoxValueBlue: { fontSize: 10, fontWeight: '700', color: '#60A5FA' },
  sectionHeader: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 10, marginTop: 10, letterSpacing: 1 },
  stateBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  stateOkBadge: { backgroundColor: '#064E3B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 14, borderWidth: 1, borderColor: '#047857' },
  okText: { color: '#34D399', fontSize: 11, fontWeight: '800' },
  stateTitle: { fontSize: 14, fontWeight: '700' },
  stateSub: { fontSize: 11 },
  card: { borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 13, fontWeight: '600' },
  subTag: { fontSize: 10, color: '#6B7280' },
  metricAlpha: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  metricBeta: { fontSize: 12, fontWeight: '700', color: '#EF4444' },
  metricTheta: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  chartContainer: { height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 8, overflow: 'hidden' },
  logsMetricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  logBox: { flex: 1, padding: 14, borderRadius: 10, marginHorizontal: 4, alignItems: 'center', borderWidth: 1 },
  logNumGreen: { fontSize: 18, fontWeight: '800', color: '#34D399' },
  logNumBlue: { fontSize: 18, fontWeight: '800', color: '#60A5FA' },
  logNumRed: { fontSize: 18, fontWeight: '800', color: '#EF4444' },
  logNumYellow: { fontSize: 18, fontWeight: '800', color: '#F59E0B' },
  logLabel: { fontSize: 10, marginTop: 4, textTransform: 'uppercase' },
  eventCard: { borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  eventTitle: { fontSize: 12, fontWeight: '600' },
  badgeHigh: { backgroundColor: '#7F1D1D', color: '#FCA5A5', fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  badgeLow: { backgroundColor: '#064E3B', color: '#6EE7B7', fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  eventSub: { fontSize: 10 },
  mapContainer: { borderRadius: 12, marginBottom: 20, borderWidth: 1, overflow: 'hidden' },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  mapHeaderText: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5 },
  mapPulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  radarScreen: { justifyContent: 'center', alignItems: 'center', position: 'relative' },
  radarNode: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#60A5FA' },
  radarNodeActive: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#34D399', borderWidth: 2, borderColor: '#064E3B' },
  radarCaption: { position: 'absolute', bottom: 8, fontSize: 9, color: '#4B5563', letterSpacing: 0.5 },
  peerCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', fontSize: 14 },
  peerName: { fontSize: 13, fontWeight: '600' },
  peerLoc: { fontSize: 10, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  pillGreen: { backgroundColor: '#064E3B' },
  pillBlue: { backgroundColor: '#1E3A8A' },
  pillText: { fontSize: 9, fontWeight: '700', color: '#34D399' },
  settingCard: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  testButton: { backgroundColor: '#0284C7', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  testButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  profileOption: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileOptionActive: { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' },
  profileText: { fontSize: 12, fontWeight: '600' },
  profileTextActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  activeCheck: { fontSize: 9, fontWeight: '800', color: '#93C5FD' },
  thresholdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  thresholdRowLast: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingParam: { fontSize: 12 },
  thresholdValue: { fontSize: 12, fontWeight: '700', color: '#38BDF8' },
  sliderTrackContainer: { marginVertical: 12 },
  sliderInteractiveArea: { height: 34, justifyContent: 'center' },
  sliderTrackBase: { height: 6, backgroundColor: '#1F2937', borderRadius: 3, position: 'relative', width: '100%' },
  sliderTrackFill: { height: 6, backgroundColor: '#38BDF8', borderRadius: 3, position: 'absolute', top: 0, left: 0 },
  sliderThumb: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF', position: 'absolute', top: -5, marginLeft: -8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 3 },
  sliderMarks: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  markText: { fontSize: 10, color: '#6B7280', fontWeight: '700' },
  chatHeaderBar: { marginBottom: 10 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#1F2937', borderRadius: 6 },
  backButtonText: { color: '#38BDF8', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  chatPeerProfileBanner: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  avatarCircleLarge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarTextLarge: { fontWeight: '800', fontSize: 18 },
  chatBubbleContainer: { marginBottom: 12, width: '100%' },
  chatBubbleLeft: { alignItems: 'flex-start' },
  chatBubbleRight: { alignItems: 'flex-end' },
  chatBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, borderWidth: 1 },
  bubbleMe: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  bubbleSender: { fontSize: 9, fontWeight: '700', color: '#38BDF8', marginBottom: 4 },
  bubbleText: { fontSize: 13, lineHeight: 18 },
  bubbleTextMe: { color: '#FFFFFF', fontSize: 13, lineHeight: 18 },
  bubbleTime: { fontSize: 9, marginTop: 4, alignSelf: 'flex-end' },
  bubbleTimeMe: { fontSize: 9, marginTop: 4, alignSelf: 'flex-end', color: '#BAE6FD' },
  chatInputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, marginTop: 10, borderWidth: 1 },
  chatTextInput: { flex: 1, paddingHorizontal: 10, fontSize: 13, height: 40 },
  sendButton: { backgroundColor: '#0284C7', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  sendButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 11 },
  popupContainer: { position: 'absolute', bottom: 70, left: 20, right: 20, borderRadius: 16, padding: 16, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10, zIndex: 999 },
  popupInner: { flexDirection: 'row', alignItems: 'center' },
  popupDeviceGraphic: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#0284C7', justifyContent: 'center', alignItems: 'center' },
  popupGraphicText: { color: '#FFFFFF', fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  popupTitle: { fontSize: 13, fontWeight: '700' },
  popupSub: { fontSize: 10, color: '#38BDF8', marginTop: 2, fontWeight: '600' },
  batteryBadge: { backgroundColor: '#064E3B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#047857' },
  batteryText: { color: '#34D399', fontWeight: '800', fontSize: 12 },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, flexDirection: 'row', borderTopWidth: 1, justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  activeNavLabel: { color: '#38BDF8', fontWeight: '800' }
});