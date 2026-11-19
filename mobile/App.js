import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const COLORS = {
  blue: '#174DA4',
  darkBlue: '#0D3B7D',
  yellow: '#F6AF18',
  orange: '#F57C18',
  ink: '#17243A',
  muted: '#718096',
  line: '#E8EDF3',
  background: '#F4F7FB',
  green: '#28A879',
  white: '#FFFFFF',
};

const INITIAL_STUDENTS = [
  { id: '1', name: 'Yasmine Diallo', initials: 'YD', grade: 'CP2', stop: 'Arrêt du marché', status: 'boarded', color: '#DCEBFF' },
  { id: '2', name: 'Fatou Abdallah', initials: 'FA', grade: 'CE1', stop: 'Rue des Palmiers', status: 'boarded', color: '#FFF0D8' },
  { id: '3', name: 'Moussa Kaboré', initials: 'MK', grade: 'CM1', stop: 'Rue des Palmiers', status: 'waiting', color: '#DFF4EC' },
  { id: '4', name: "Aïcha N'Diaye", initials: 'AN', grade: 'CP1', stop: 'Avenue Centrale', status: 'waiting', color: '#EEE7FF' },
];

const TABS = [
  { id: 'home', label: 'Accueil', icon: '⌂' },
  { id: 'students', label: 'Élèves', icon: '♙' },
  { id: 'alerts', label: 'Alertes', icon: '◉' },
  { id: 'history', label: 'Trajets', icon: '↻' },
];

function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandIcon}><Text style={styles.brandBus}>🚌</Text></View>
      <View><Text style={styles.brandName}>Go<Text style={styles.brandYellow}>Bus</Text></Text><Text style={styles.brandTagline}>TRANSPORT SCOLAIRE SÉCURISÉ</Text></View>
    </View>
  );
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <View style={styles.sectionTitle}>
      <View><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.heading}>{title}</Text></View>
      {action || null}
    </View>
  );
}

function MapPreview({ wide }) {
  return (
    <View style={[styles.map, wide && styles.mapWide]}>
      <View style={styles.mapBlockOne} /><View style={styles.mapBlockTwo} /><View style={styles.mapBlockThree} />
      <View style={[styles.road, styles.roadA]} /><View style={[styles.road, styles.roadB]} /><View style={[styles.road, styles.roadC]} />
      <View style={styles.routeLine} />
      <View style={[styles.mapStop, { left: '14%', top: '68%' }]}><Text style={styles.mapStopText}>1</Text></View>
      <View style={[styles.mapStop, { left: '43%', top: '52%' }]}><Text style={styles.mapStopText}>2</Text></View>
      <View style={[styles.mapStop, { left: '72%', top: '31%' }]}><Text style={styles.mapStopText}>3</Text></View>
      <View style={styles.busPin}><Text style={{ fontSize: 24 }}>🚌</Text></View>
      <View style={styles.schoolPin}><Text style={styles.schoolPinText}>🏫 École</Text></View>
      <View style={styles.mapLegend}><View style={styles.liveDot} /><Text style={styles.mapLegendText}>Position simulée</Text></View>
    </View>
  );
}

function StudentRow({ student, onToggle, parentMode }) {
  const boarded = student.status === 'boarded';
  return (
    <View style={styles.studentRow}>
      <View style={[styles.initials, { backgroundColor: student.color }]}><Text style={styles.initialsText}>{student.initials}</Text></View>
      <View style={styles.studentDetails}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentMeta}>{parentMode ? `Votre enfant • ${student.stop}` : `Classe ${student.grade} • ${student.stop}`}</Text>
      </View>
      <View style={[styles.statusPill, boarded ? styles.statusBoarded : styles.statusWaiting]}>
        <Text style={[styles.statusText, { color: boarded ? COLORS.green : '#B76B13' }]}>{boarded ? 'À bord' : 'En attente'}</Text>
      </View>
      {!parentMode && (
        <TouchableOpacity style={[styles.pointButton, boarded && styles.pointButtonDone]} onPress={() => onToggle(student.id)} accessibilityLabel={boarded ? 'Marquer comme descendu' : 'Pointer la montée'}>
          <Text style={[styles.pointButtonText, boarded && styles.pointButtonTextDone]}>{boarded ? 'Descendre' : 'Pointer'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const tablet = width >= 760;
  const [role, setRole] = useState('parent');
  const [tab, setTab] = useState('home');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const parentMode = role === 'parent';
  const child = students[0];
  const onboardCount = useMemo(() => students.filter((s) => s.status === 'boarded').length, [students]);

  const toggleStudent = (id) => {
    setStudents((current) => current.map((student) => student.id === id ? { ...student, status: student.status === 'boarded' ? 'waiting' : 'boarded' } : student));
  };

  const screenTitle = {
    home: parentMode ? 'Bonjour, Mamadou 👋' : 'Bonjour, Awa 👋',
    students: 'Pointage des élèves',
    alerts: 'Notifications',
    history: 'Historique des trajets',
  }[tab];

  const renderHome = () => (
    <>
      <SectionTitle eyebrow="MERCREDI 19 NOVEMBRE · TRAJET DU MATIN" title={parentMode ? 'Le bus est en route' : 'Trajet en cours'} />
      <View style={[styles.homeGrid, tablet && styles.homeGridTablet]}>
        <View style={styles.mainColumn}>
          <Card style={styles.mapCard}>
            <View style={styles.cardHeader}>
              <View><Text style={styles.cardEyebrow}>LIGNE A · BUS BS-204</Text><Text style={styles.cardTitle}>École Internationale</Text></View>
              <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>EN DIRECT</Text></View>
            </View>
            <MapPreview wide={tablet} />
            <View style={styles.tripStats}>
              <View style={styles.tripStat}><Text style={styles.statLabel}>ARRIVÉE ESTIMÉE</Text><Text style={styles.statValue}>07:42</Text><Text style={styles.statHint}>dans environ 18 min</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.tripStat}><Text style={styles.statLabel}>VITESSE DU BUS</Text><Text style={styles.statValue}>42 <Text style={styles.statUnit}>km/h</Text></Text><Text style={styles.safeHint}>✓ Dans la limite</Text></View>
            </View>
          </Card>
          {!parentMode && <Card style={styles.quickCard}>
            <SectionTitle eyebrow="SUIVI DES ÉLÈVES" title={`${onboardCount} sur ${students.length} à bord`} action={<TouchableOpacity onPress={() => setTab('students')}><Text style={styles.linkText}>Voir la liste ›</Text></TouchableOpacity>} />
            {students.slice(0, 3).map((student) => <StudentRow key={student.id} student={student} onToggle={toggleStudent} parentMode={false} />)}
          </Card>}
        </View>
        <View style={styles.sideColumn}>
          <Card>
            <Text style={styles.cardEyebrow}>PROCHAIN ARRÊT</Text>
            <View style={styles.nextStopRow}><View style={styles.locationIcon}><Text style={{ fontSize: 19 }}>📍</Text></View><View><Text style={styles.cardTitle}>Rue des Palmiers</Text><Text style={styles.cardSub}>Arrivée estimée à 07:42</Text></View></View>
            <View style={styles.separator} />
            <Text style={styles.cardSub}>2 élèves attendus à cet arrêt</Text>
          </Card>
          <Card style={styles.safetyCard}>
            <View style={styles.safetyIcon}><Text style={styles.safetyCheck}>✓</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.cardEyebrow}>SÉCURITÉ DU TRAJET</Text><Text style={styles.safetyTitle}>Tout est conforme</Text><Text style={styles.cardSub}>Aucune alerte de vitesse</Text></View>
          </Card>
          {parentMode && <Card style={styles.childCard}>
            <Text style={styles.cardEyebrow}>SUIVI DE VOTRE ENFANT</Text>
            <StudentRow student={child} onToggle={toggleStudent} parentMode />
            <Text style={styles.parentNote}>Une notification vous sera envoyée à la montée et à la descente.</Text>
          </Card>}
        </View>
      </View>
    </>
  );

  const renderStudents = () => (
    <>
      <SectionTitle eyebrow="TRAJET DU MATIN · LIGNE A" title="Liste des élèves" action={!parentMode ? <TouchableOpacity style={styles.primaryButton} onPress={() => setStudents((current) => current.map((s) => ({ ...s, status: 'boarded' })))}><Text style={styles.primaryButtonText}>Pointer tous</Text></TouchableOpacity> : null} />
      <Card style={styles.listCard}>
        <Text style={styles.cardSub}>{parentMode ? 'Informations de suivi de votre enfant' : `${onboardCount} élèves pointés sur ${students.length}`}</Text>
        {(parentMode ? students.filter((s) => s.id === '1') : students).map((student) => <StudentRow key={student.id} student={student} onToggle={toggleStudent} parentMode={parentMode} />)}
      </Card>
    </>
  );

  const renderAlerts = () => (
    <>
      <SectionTitle eyebrow="INFORMATIONS DU TRAJET" title="Notifications" />
      <Card style={styles.listCard}>
        {[
          { icon: '📍', title: 'Le bus approche de votre arrêt', detail: 'Arrivée estimée dans 4 minutes à Rue des Palmiers.', time: 'À l’instant', tint: '#EAF2FF' },
          { icon: '✓', title: parentMode ? `${child.name} est à bord` : 'Yasmine est montée dans le bus', detail: 'Pointage confirmé à l’arrêt du marché.', time: 'Il y a 12 minutes', tint: '#FFF3D7' },
          { icon: '✓', title: 'Le trajet a commencé', detail: 'Le bus BS-204 est parti de son point de départ.', time: 'Il y a 28 minutes', tint: '#EAF8F2' },
        ].map((item) => <View key={item.title} style={styles.alertRow}><View style={[styles.alertIcon, { backgroundColor: item.tint }]}><Text style={styles.alertEmoji}>{item.icon}</Text></View><View style={{ flex: 1 }}><Text style={styles.studentName}>{item.title}</Text><Text style={styles.alertDetail}>{item.detail}</Text><Text style={styles.alertTime}>{item.time}</Text></View></View>)}
      </Card>
      <Text style={styles.demoNote}>Prototype de démonstration : ces notifications sont fictives.</Text>
    </>
  );

  const renderHistory = () => (
    <>
      <SectionTitle eyebrow="ACTIVITÉ RÉCENTE" title="Historique des trajets" />
      <Card style={styles.listCard}>
        {[['19', 'NOV', 'Matin — École Internationale', '06:30 → 07:42 · 4 élèves à bord'], ['18', 'NOV', 'Soir — Retour à domicile', '16:10 → 17:35 · Aucun incident'], ['18', 'NOV', 'Matin — École Internationale', '06:32 → 07:40 · Trajet terminé']].map(([day, month, title, details]) => (
          <View key={`${day}-${title}`} style={styles.historyRow}><View style={styles.dateBadge}><Text style={styles.dateDay}>{day}</Text><Text style={styles.dateMonth}>{month}</Text></View><View style={{ flex: 1 }}><Text style={styles.studentName}>{title}</Text><Text style={styles.alertDetail}>{details}</Text></View><Text style={styles.doneTag}>Terminé</Text></View>
        ))}
      </Card>
    </>
  );

  const content = tab === 'home' ? renderHome() : tab === 'students' ? renderStudents() : tab === 'alerts' ? renderAlerts() : renderHistory();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={[styles.app, tablet && styles.appTablet]}>
        {tablet && <View style={styles.sidebar}>
          <Brand />
          <Text style={styles.sideLabel}>MENU</Text>
          {TABS.map((item) => <TouchableOpacity key={item.id} onPress={() => setTab(item.id)} style={[styles.sideTab, tab === item.id && styles.sideTabActive]}><Text style={[styles.sideTabIcon, tab === item.id && styles.sideTabTextActive]}>{item.icon}</Text><Text style={[styles.sideTabText, tab === item.id && styles.sideTabTextActive]}>{item.label}</Text></TouchableOpacity>)}
          <View style={styles.sideSpacer} />
          <View style={styles.routeSummary}><Text style={styles.routeLabel}>MA LIGNE</Text><Text style={styles.routeName}>Ligne A</Text><Text style={styles.routeSub}>Bus BS-204 · Matin</Text></View>
          <View style={styles.profile}><View style={styles.profileAvatar}><Text style={styles.profileInitials}>{parentMode ? 'MM' : 'AM'}</Text></View><View><Text style={styles.profileName}>{parentMode ? 'Mamadou M.' : 'Awa Mamadou'}</Text><Text style={styles.profileRole}>{parentMode ? 'Parent' : 'Accompagnatrice'}</Text></View></View>
        </View>}
        <View style={styles.main}>
          <View style={styles.topbar}>
            {!tablet && <Brand />}
            <Text style={styles.pageTitle}>{screenTitle}</Text>
            <View style={styles.roleSwitcher}>{[['parent', 'Parent'], ['companion', 'Accompagnateur']].map(([id, label]) => <TouchableOpacity key={id} onPress={() => setRole(id)} style={[styles.roleButton, role === id && styles.roleButtonActive]}><Text style={[styles.roleButtonText, role === id && styles.roleButtonTextActive]}>{label}</Text></TouchableOpacity>)}</View>
          </View>
          <ScrollView contentContainerStyle={[styles.content, tablet && styles.contentTablet]} showsVerticalScrollIndicator={false}>{content}<View style={styles.footer}><Text style={styles.demoNote}>GoBus · Maquette de démonstration · Données fictives</Text></View></ScrollView>
          {!tablet && <View style={styles.bottomNav}>{TABS.map((item) => <TouchableOpacity key={item.id} onPress={() => setTab(item.id)} style={[styles.bottomTab, tab === item.id && styles.bottomTabActive]}><Text style={[styles.bottomIcon, tab === item.id && styles.bottomIconActive]}>{item.icon}</Text><Text style={[styles.bottomLabel, tab === item.id && styles.bottomLabelActive]}>{item.label}</Text></TouchableOpacity>)}</View>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  app: { flex: 1 },
  appTablet: { flexDirection: 'row' },
  sidebar: { width: 248, backgroundColor: COLORS.white, borderRightWidth: 1, borderRightColor: COLORS.line, paddingHorizontal: 18, paddingTop: 28, paddingBottom: 18 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4, marginBottom: 20 },
  brandIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  brandBus: { fontSize: 24 }, brandName: { color: COLORS.blue, fontSize: 21, fontWeight: '900', letterSpacing: -0.5 }, brandYellow: { color: COLORS.yellow }, brandTagline: { color: COLORS.muted, fontSize: 8, letterSpacing: 0.7, marginTop: 2, fontWeight: '700' },
  sideLabel: { color: '#A0AAB8', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: 20, marginBottom: 10, marginLeft: 10 },
  sideTab: { height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, marginBottom: 4 }, sideTabActive: { backgroundColor: '#EDF4FF' }, sideTabIcon: { width: 23, color: '#8490A1', fontSize: 20, textAlign: 'center' }, sideTabText: { color: '#69758A', fontSize: 13, fontWeight: '700' }, sideTabTextActive: { color: COLORS.blue }, sideSpacer: { flex: 1 },
  routeSummary: { backgroundColor: COLORS.blue, borderRadius: 15, padding: 14, marginBottom: 14 }, routeLabel: { color: '#D5E4FF', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }, routeName: { color: COLORS.white, fontWeight: '900', fontSize: 18, marginTop: 9 }, routeSub: { color: '#D5E4FF', fontSize: 10, marginTop: 3 },
  profile: { borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 14, flexDirection: 'row', alignItems: 'center', gap: 9 }, profileAvatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#DCE8FA', alignItems: 'center', justifyContent: 'center' }, profileInitials: { color: COLORS.blue, fontWeight: '900', fontSize: 11 }, profileName: { color: COLORS.ink, fontWeight: '800', fontSize: 11 }, profileRole: { color: COLORS.muted, fontSize: 9, marginTop: 3 },
  main: { flex: 1, minWidth: 0 }, topbar: { minHeight: 75, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, pageTitle: { color: COLORS.ink, fontSize: 20, fontWeight: '900', flex: 1 }, roleSwitcher: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 3, borderRadius: 11, borderWidth: 1, borderColor: COLORS.line }, roleButton: { paddingVertical: 9, paddingHorizontal: 10, borderRadius: 8 }, roleButtonActive: { backgroundColor: COLORS.blue }, roleButtonText: { color: COLORS.muted, fontSize: 10, fontWeight: '800' }, roleButtonTextActive: { color: COLORS.white },
  content: { padding: 16, paddingTop: 8, paddingBottom: 24 }, contentTablet: { paddingHorizontal: 28, paddingTop: 18, maxWidth: 1440, width: '100%', alignSelf: 'center' }, sectionTitle: { minHeight: 64, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }, eyebrow: { color: COLORS.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginBottom: 5 }, heading: { color: COLORS.ink, fontSize: 20, fontWeight: '900' }, homeGrid: { gap: 14 }, homeGridTablet: { flexDirection: 'row', alignItems: 'flex-start' }, mainColumn: { flex: 1.65, gap: 14 }, sideColumn: { flex: 1, gap: 12 },
  card: { backgroundColor: COLORS.white, borderColor: COLORS.line, borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 12 }, mapCard: { padding: 0, overflow: 'hidden' }, cardHeader: { padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, cardEyebrow: { color: COLORS.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }, cardTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '900', marginTop: 5 }, cardSub: { color: COLORS.muted, fontSize: 10, marginTop: 4, lineHeight: 15 }, liveBadge: { backgroundColor: '#EDF9F5', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 6 }, liveDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: COLORS.green }, liveText: { color: '#21855F', fontSize: 8, fontWeight: '900' },
  map: { height: 270, backgroundColor: '#EDF3EC', overflow: 'hidden', position: 'relative', borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.line }, mapWide: { height: 360 }, mapBlockOne: { position: 'absolute', width: '30%', height: '32%', left: '4%', top: '8%', backgroundColor: '#E0EBDD', borderRadius: 18 }, mapBlockTwo: { position: 'absolute', width: '24%', height: '28%', right: '5%', top: '10%', backgroundColor: '#E1EDDF', borderRadius: 18 }, mapBlockThree: { position: 'absolute', width: '24%', height: '25%', left: '42%', bottom: '5%', backgroundColor: '#E1EDDF', borderRadius: 18 }, road: { position: 'absolute', height: 20, width: '140%', backgroundColor: '#FFFFFF', borderColor: '#DDE5E6', borderTopWidth: 2, borderBottomWidth: 2, left: '-18%' }, roadA: { top: '52%', transform: [{ rotate: '-18deg' }] }, roadB: { top: '37%', transform: [{ rotate: '66deg' }] }, roadC: { top: '38%', transform: [{ rotate: '-68deg' }], left: '32%' }, routeLine: { position: 'absolute', width: '60%', height: 4, left: '17%', top: '52%', backgroundColor: COLORS.yellow, borderRadius: 4, transform: [{ rotate: '-24deg' }] }, mapStop: { position: 'absolute', width: 25, height: 25, borderRadius: 14, backgroundColor: COLORS.white, borderColor: COLORS.yellow, borderWidth: 3, alignItems: 'center', justifyContent: 'center', zIndex: 2 }, mapStopText: { color: COLORS.blue, fontSize: 9, fontWeight: '900' }, busPin: { position: 'absolute', left: '48%', top: '38%', width: 47, height: 47, borderRadius: 15, backgroundColor: COLORS.yellow, borderWidth: 4, borderColor: COLORS.white, alignItems: 'center', justifyContent: 'center', elevation: 4, zIndex: 3 }, schoolPin: { position: 'absolute', right: '5%', top: '24%', backgroundColor: COLORS.blue, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 7 }, schoolPinText: { color: COLORS.white, fontSize: 9, fontWeight: '800' }, mapLegend: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 6 }, mapLegendText: { color: COLORS.muted, fontSize: 9, fontWeight: '700' },
  tripStats: { minHeight: 88, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-around' }, tripStat: { flex: 1 }, statLabel: { color: COLORS.muted, fontSize: 8, letterSpacing: 0.5, fontWeight: '800' }, statValue: { color: COLORS.ink, fontSize: 20, fontWeight: '900', marginTop: 4 }, statUnit: { fontSize: 10, fontWeight: '700' }, statHint: { color: COLORS.muted, fontSize: 9, marginTop: 2 }, safeHint: { color: COLORS.green, fontSize: 9, marginTop: 2, fontWeight: '700' }, statDivider: { width: 1, height: 42, backgroundColor: COLORS.line, marginHorizontal: 12 },
  nextStopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15, marginBottom: 13 }, locationIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EDF4FF', alignItems: 'center', justifyContent: 'center' }, separator: { height: 1, backgroundColor: COLORS.line, marginBottom: 8 }, safetyCard: { flexDirection: 'row', alignItems: 'center', gap: 11 }, safetyIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EDF9F5', alignItems: 'center', justifyContent: 'center' }, safetyCheck: { color: COLORS.green, fontSize: 20, fontWeight: '900' }, safetyTitle: { color: COLORS.ink, fontWeight: '900', fontSize: 13, marginTop: 4 }, childCard: { paddingBottom: 10 }, parentNote: { color: COLORS.muted, fontSize: 9, lineHeight: 14, borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 9 }, quickCard: { paddingBottom: 6 }, linkText: { color: COLORS.blue, fontSize: 10, fontWeight: '800' },
  studentRow: { minHeight: 67, borderBottomWidth: 1, borderBottomColor: COLORS.line, flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 8 }, initials: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, initialsText: { color: COLORS.blue, fontWeight: '900', fontSize: 10 }, studentDetails: { flex: 1, minWidth: 80 }, studentName: { color: COLORS.ink, fontWeight: '800', fontSize: 11 }, studentMeta: { color: COLORS.muted, fontSize: 9, marginTop: 4 }, statusPill: { borderRadius: 15, paddingVertical: 6, paddingHorizontal: 7 }, statusBoarded: { backgroundColor: '#EDF9F5' }, statusWaiting: { backgroundColor: '#FFF3DF' }, statusText: { fontSize: 8, fontWeight: '900' }, pointButton: { backgroundColor: COLORS.blue, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 9 }, pointButtonText: { color: COLORS.white, fontWeight: '800', fontSize: 9 }, pointButtonDone: { backgroundColor: '#FFF3DF' }, pointButtonTextDone: { color: '#B76B13' }, primaryButton: { backgroundColor: COLORS.blue, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 }, primaryButtonText: { color: COLORS.white, fontSize: 10, fontWeight: '900' }, listCard: { paddingTop: 12 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 80, borderBottomWidth: 1, borderBottomColor: COLORS.line, paddingVertical: 10 }, alertIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, alertEmoji: { fontSize: 17, color: COLORS.blue, fontWeight: '900' }, alertDetail: { color: COLORS.muted, fontSize: 9, lineHeight: 14, marginTop: 4 }, alertTime: { color: '#A2AABA', fontSize: 8, marginTop: 4 }, demoNote: { color: '#98A3B2', fontSize: 9, textAlign: 'center', marginTop: 13 }, historyRow: { minHeight: 75, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: COLORS.line }, dateBadge: { width: 42, height: 44, borderRadius: 11, backgroundColor: '#EDF4FF', alignItems: 'center', justifyContent: 'center' }, dateDay: { color: COLORS.blue, fontSize: 15, fontWeight: '900' }, dateMonth: { color: COLORS.blue, fontSize: 7, fontWeight: '900' }, doneTag: { color: COLORS.green, backgroundColor: '#EDF9F5', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 14, fontSize: 8, fontWeight: '900' }, footer: { paddingBottom: 8 }, bottomNav: { height: 62, flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.line, paddingHorizontal: 4, paddingBottom: 4 }, bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 10, margin: 3 }, bottomTabActive: { backgroundColor: '#EDF4FF' }, bottomIcon: { color: '#929DAD', fontSize: 18 }, bottomIconActive: { color: COLORS.blue }, bottomLabel: { color: '#929DAD', fontSize: 8, fontWeight: '700' }, bottomLabelActive: { color: COLORS.blue },
});
