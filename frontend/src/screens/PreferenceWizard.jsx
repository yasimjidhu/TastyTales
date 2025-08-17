import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { submitPreferences } from "../store/slices/user";
import { LinearGradient } from "expo-linear-gradient";


const { width } = Dimensions.get("window");

const STEPS = {
  DIET: 0,
  ROLE: 1,
  SKILL: 2,
  TASTE: 3,
  EXTRA: 4,
  SUMMARY: 4,
};

const dietOptions = [
  {
    key: "vegetarian",
    label: "Vegetarian",
    icon: "leaf-outline",
    gradient: ["#14b8a6", "#0f766e"],
  },
  {
    key: "non_veg",
    label: "Non-Veg",
    icon: "restaurant-outline",
    gradient: ["#0d9488", "#134e4a"],
  },
  {
    key: "vegan",
    label: "Vegan",
    icon: "nutrition-outline",
    gradient: ["#14b8a6", "#0f766e"],
  },
  {
    key: "eggetarian",
    label: "Eggetarian",
    icon: "egg-outline",
    gradient: ["#0d9488", "#134e4a"],
  },
];

const roleOptions = [
  {
    key: "student",
    label: "Student",
    icon: "school-outline",
    gradient: ["#14b8a6", "#0f766e"],
  },
  {
    key: "hostler",
    label: "Hostler",
    icon: "home-outline",
    gradient: ["#0d9488", "#134e4a"],
  },
  {
    key: "professional",
    label: "Professional",
    icon: "briefcase-outline",
    gradient: ["#14b8a6", "#0f766e"],
  },
  {
    key: "home_cook",
    label: "Home Cook",
    icon: "people-outline",
    gradient: ["#0d9488", "#134e4a"],
  },
];

const skillOptions = [
  {
    key: "beginner",
    label: "Beginner",
    sub: "Instant & easy recipes",
    icon: "trending-up-outline",
    accent: "#14b8a6",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    sub: "Basic cooking skills",
    icon: "speedometer-outline",
    accent: "#0d9488",
  },
  {
    key: "expert",
    label: "Expert",
    sub: "Advanced & experimental",
    icon: "flask-outline",
    accent: "#0f766e",
  },
];

const tasteOptions = [
  { key: "quick_15", label: "Quick (<15m)", icon: "flash-outline" },
  { key: "budget", label: "Budget friendly", icon: "wallet-outline" },
  { key: "spicy", label: "Spicy lover", icon: "flame-outline" },
  { key: "drinks", label: "Drinks & smoothies", icon: "wine-outline" },
  { key: "desserts", label: "Desserts", icon: "ice-cream-outline" },
];

const cuisineOptions = [
  { id: "indian", name: "Indian", icon: "restaurant-outline" },
  { id: "italian", name: "Italian", icon: "pizza-outline" },
  { id: "chinese", name: "Chinese", icon: "fish-outline" },
  { id: "mexican", name: "Mexican", icon: "fast-food-outline" },
];

const allergyOptions = [
  { id: "nuts", name: "Nuts", icon: "warning-outline" },
  { id: "gluten", name: "Gluten", icon: "alert-circle-outline" },
  { id: "dairy", name: "Dairy", icon: "stop-circle-outline" },
];

const healthGoalOptions = [
  { id: "weight-loss", name: "Weight Loss", icon: "fitness-outline" },
  { id: "high-protein", name: "High Protein", icon: "barbell-outline" },
  { id: "low-carb", name: "Low Carb", icon: "heart-outline" },
];

export default function PreferenceWizard({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);

  const [step, setStep] = useState(STEPS.DIET);
  const [diet, setDiet] = useState(null);
  const [role, setRole] = useState(null);
  const [skill, setSkill] = useState(null);
  const [tastes, setTastes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const canNext = useMemo(() => {
    if (step === STEPS.DIET) return !!diet;
    if (step === STEPS.ROLE) return !!role;
    if (step === STEPS.SKILL) return !!skill;
    if (step === STEPS.TASTE) return true;
    return true;
  }, [step, diet, role, skill]);

  const goNext = () => {
    if (step < STEPS.SUMMARY) setStep((p) => p + 1);
  };

  const goBack = () => {
    if (step > STEPS.DIET) setStep((p) => p - 1);
  };

  const toggleMulti = (arr, setArr, key) => {
    if (arr.includes(key)) setArr(arr.filter((k) => k !== key));
    else setArr([...arr, key]);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        diet,
        role,
        skill,
        preferences: tastes,
        cuisines,
        allergies,
        healthGoals,
      };

      const response = await dispatch(submitPreferences(payload)).unwrap();

      console.log("Preferences submitted successfully in page", response);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("submit error", e);
    }
  };

  const getStepInfo = () => {
    const steps = [
      { title: "Dietary Preferences", desc: "Tell us what you eat" },
      { title: "About You", desc: "Help us understand your lifestyle" },
      { title: "Cooking Skills", desc: "What's your experience level?" },
      { title: "Food Interests", desc: "What excites your taste buds?" },
      { title: "Final Review", desc: "Let's confirm your preferences" },
    ];
    return steps[step] || steps[0];
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${((step + 1) / 5) * 100}%` }]}
        />
      </View>
      <Text style={styles.progressText}>{step + 1} of 5</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />

      {/* Elegant Header */}
      <LinearGradient
        colors={["#14b8a6", "#0f766e"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={step === STEPS.DIET ? navigation.goBack : goBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={26} color="white" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{getStepInfo().title}</Text>
            <Text style={styles.headerSubtitle}>{getStepInfo().desc}</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <ProgressIndicator />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        bounces={false}
      >
        {/* Diet Step */}
        {step === STEPS.DIET && (
          <View style={styles.stepContainer}>
            <View style={styles.grid}>
              {dietOptions.map((opt, index) => (
                <ElegantCard
                  key={opt.key}
                  active={diet === opt.key}
                  onPress={() => setDiet(opt.key)}
                  gradient={opt.gradient}
                  delay={index * 100}
                >
                  <View style={styles.cardIconContainer}>
                    <Ionicons
                      name={opt.icon}
                      size={28}
                      color={diet === opt.key ? "white" : "#0f766e"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.cardLabel,
                      { color: diet === opt.key ? "white" : "#0f766e" },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </ElegantCard>
              ))}
            </View>
          </View>
        )}

        {/* Role Step */}
        {/* Role Step - Single Select */}
        {step === STEPS.ROLE && (
          <View style={styles.stepContainer}>
            <View style={styles.grid}>
              {roleOptions.map((opt, index) => (
                <ElegantCard
                  key={opt.key}
                  active={role === opt.key} // Compare with single value
                  onPress={() => setRole(opt.key)} // Set single value on press
                  gradient={opt.gradient}
                  delay={index * 100}
                >
                  <View style={styles.cardIconContainer}>
                    <Ionicons
                      name={opt.icon}
                      size={28}
                      color={role === opt.key ? "white" : "#0f766e"} // Compare with single value
                    />
                  </View>
                  <Text
                    style={[
                      styles.cardLabel,
                      { color: role === opt.key ? "white" : "#0f766e" }, // Compare with single value
                    ]}
                  >
                    {opt.label}
                  </Text>
                </ElegantCard>
              ))}
            </View>
          </View>
        )}

        {/* Skill Step */}
        {step === STEPS.SKILL && (
          <View style={styles.stepContainer}>
            <View style={styles.skillContainer}>
              {skillOptions.map((opt, index) => (
                <ElegantListOption
                  key={opt.key}
                  title={opt.label}
                  subtitle={opt.sub}
                  icon={opt.icon}
                  active={skill === opt.key}
                  onPress={() => setSkill(opt.key)}
                  accent={opt.accent}
                  delay={index * 150}
                />
              ))}
            </View>
          </View>
        )}

        {/* Taste Step */}
        {step === STEPS.TASTE && (
          <View style={styles.stepContainer}>
            <View style={styles.chipsGrid}>
              {tasteOptions.map((opt, index) => (
                <ElegantChip
                  key={opt.key}
                  label={opt.label}
                  icon={opt.icon}
                  active={tastes.includes(opt.key)}
                  onPress={() => toggleMulti(tastes, setTastes, opt.key)}
                  delay={index * 100}
                />
              ))}
            </View>
          </View>
        )}

        {/* Extra/Summary Steps */}
        {step === STEPS.EXTRA && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Preferred Cuisines</Text>
            <View style={styles.chipsGrid}>
              {cuisineOptions.map((opt, index) => (
                <ElegantChip
                  key={opt.id}
                  label={opt.name}
                  icon={opt.icon}
                  active={cuisines.includes(opt.id)}
                  onPress={() => toggleMulti(cuisines, setCuisines, opt.id)}
                  delay={index * 80}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Food Allergies</Text>
            <View style={styles.chipsGrid}>
              {allergyOptions.map((opt, index) => (
                <ElegantChip
                  key={opt.id}
                  label={opt.name}
                  icon={opt.icon}
                  active={allergies.includes(opt.id)}
                  onPress={() => toggleMulti(allergies, setAllergies, opt.id)}
                  delay={index * 80}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Health Goals</Text>
            <View style={styles.chipsGrid}>
              {healthGoalOptions.map((opt, index) => (
                <ElegantChip
                  key={opt.id}
                  label={opt.name}
                  icon={opt.icon}
                  active={healthGoals.includes(opt.id)}
                  onPress={() =>
                    toggleMulti(healthGoals, setHealthGoals, opt.id)
                  }
                  delay={index * 80}
                />
              ))}
            </View>
          </View>
        )}

        {step === STEPS.SUMMARY && (
          <View style={styles.stepContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="checkmark-circle" size={32} color="#14b8a6" />
                <Text style={styles.summaryHeaderText}>
                  Perfect! You're all set
                </Text>
              </View>

              <SummaryRow
                icon="restaurant-outline"
                label="Diet"
                value={
                  dietOptions.find((d) => d.key === diet)?.label ||
                  "Not selected"
                }
              />
              <SummaryRow
                icon="people-outline"
                label="Lifestyle"
                value={
                  role
                    ? roleOptions.find((o) => o.key === role)?.label ||
                      "Not selected"
                    : "Not selected"
                }
              />
              <SummaryRow
                icon="speedometer-outline"
                label="Skill Level"
                value={
                  skillOptions.find((s) => s.key === skill)?.label ||
                  "Not selected"
                }
              />
              <SummaryRow
                icon="heart-outline"
                label="Interests"
                value={
                  tastes.length
                    ? tastes
                        .map(
                          (k) => tasteOptions.find((t) => t.key === k)?.label
                        )
                        .filter(Boolean)
                        .join(", ")
                    : "None selected"
                }
                last
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Elegant Footer */}
      <View style={styles.footer}>
        {step < STEPS.SUMMARY ? (
          <TouchableOpacity
            style={[styles.primaryBtn, { opacity: canNext ? 1 : 0.6 }]}
            onPress={goNext}
            disabled={!canNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={canNext ? ["#14b8a6", "#0f766e"] : ["#9ca3af", "#6b7280"]}
              style={styles.btnGradient}
            >
              <Text style={styles.primaryBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryBtn, { opacity: loading ? 0.7 : 1 }]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={loading ? ["#9ca3af", "#6b7280"] : ["#14b8a6", "#0f766e"]}
              style={styles.btnGradient}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? "Setting up..." : "Start Cooking! 🚀"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function ElegantCard({ active, onPress, gradient, children, delay = 0 }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.elegantCard,
        {
          transform: [{ scale: active ? 0.98 : 1 }],
        },
      ]}
    >
      {active ? (
        <LinearGradient colors={gradient} style={styles.cardGradient}>
          {children}
          <View style={styles.activeIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.cardDefault}>{children}</View>
      )}
    </TouchableOpacity>
  );
}

function ElegantListOption({
  title,
  subtitle,
  icon,
  active,
  onPress,
  accent,
  delay = 0,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.elegantListItem}
    >
      {active ? (
        <LinearGradient
          colors={["#14b8a6", "#0f766e"]}
          style={styles.listItemGradient}
        >
          <View style={styles.listItemContent}>
            <View style={styles.listIconContainer}>
              <Ionicons name={icon} size={24} color="white" />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={[styles.listTitle, { color: "white" }]}>
                {title}
              </Text>
              <Text
                style={[
                  styles.listSubtitle,
                  { color: "rgba(255,255,255,0.8)" },
                ]}
              >
                {subtitle}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.listItemDefault}>
          <View style={styles.listItemContent}>
            <View
              style={[styles.listIconContainer, { backgroundColor: "#e6fffa" }]}
            >
              <Ionicons name={icon} size={24} color={accent} />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={[styles.listTitle, { color: "#0f766e" }]}>
                {title}
              </Text>
              <Text style={[styles.listSubtitle, { color: "#64748b" }]}>
                {subtitle}
              </Text>
            </View>
            <View style={styles.radioButton}>
              <View style={styles.radioInner} />
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ElegantChip({ label, icon, active, onPress, delay = 0 }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.chipContainer}
    >
      {active ? (
        <LinearGradient
          colors={["#14b8a6", "#0f766e"]}
          style={styles.chipGradient}
        >
          <Ionicons name={icon} size={16} color="white" />
          <Text style={[styles.chipText, { color: "white" }]}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.chipDefault}>
          <Ionicons name={icon} size={16} color="#0f766e" />
          <Text style={[styles.chipText, { color: "#0f766e" }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function SummaryRow({ icon, label, value, last }) {
  return (
    <View style={[styles.summaryRow, !last && styles.summaryRowBorder]}>
      <View style={styles.summaryRowLeft}>
        <View style={styles.summaryIcon}>
          <Ionicons name={icon} size={20} color="#14b8a6" />
        </View>
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
      <Text style={styles.summaryValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Primary-ExtraBold",
    fontSize: 20,
    color: "white",
  },
  headerSubtitle: {
    fontFamily: "Primary-Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  headerSpacer: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 2,
  },
  progressText: {
    fontFamily: "Primary-Bold",
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  container: {
    paddingBottom: 120,
  },
  stepContainer: {
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  elegantCard: {
    width: (width - 56) / 2,
    height: 120,
    marginBottom: 16,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#14b8a6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardDefault: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e0f2fe",
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconContainer: {
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: "Primary-Bold",
    fontSize: 15,
    textAlign: "center",
  },
  activeIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  skillContainer: {
    gap: 16,
  },
  elegantListItem: {
    marginBottom: 12,
  },
  listItemGradient: {
    borderRadius: 18,
    shadowColor: "#14b8a6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  listItemDefault: {
    borderRadius: 18,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e0f2fe",
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontFamily: "Primary-ExtraBold",
    fontSize: 18,
    marginBottom: 4,
  },
  listSubtitle: {
    fontFamily: "Primary-Regular",
    fontSize: 14,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  chipContainer: {
    marginBottom: 8,
  },
  chipGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: "#14b8a6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  chipDefault: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e0f2fe",
    gap: 8,
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontFamily: "Primary-Bold",
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: "Primary-ExtraBold",
    fontSize: 20,
    color: "#0f766e",
    marginBottom: 16,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  summaryHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  summaryHeaderText: {
    fontFamily: "Primary-ExtraBold",
    fontSize: 20,
    color: "#0f766e",
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f9ff",
  },
  summaryRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e6fffa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryLabel: {
    fontFamily: "Primary-Bold",
    fontSize: 16,
    color: "#0f766e",
  },
  summaryValue: {
    fontFamily: "Primary-Regular",
    fontSize: 14,
    color: "#64748b",
    flex: 1,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#e0f2fe",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  btnGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnText: {
    color: "white",
    fontFamily: "Primary-Bold",
  },
});
