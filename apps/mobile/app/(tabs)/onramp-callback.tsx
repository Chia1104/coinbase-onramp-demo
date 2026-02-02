import { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import VectorIcon from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Card, Spinner, Divider } from "heroui-native";

import { PageLayout } from "@/components/page-layout";

type OnrampStatus = "pending" | "completed" | "failed";

type StepState = "completed" | "in_progress" | "pending" | "failed";

const STEPS = [
  { id: "session", label: "Session Created" },
  { id: "payment", label: "Payment Processing" },
  { id: "done", label: "Completed" },
] as const;

const CONNECTOR_HEIGHT = 32;
const LINE_FILL_DURATION = 600;
const STAGGER_DELAY = 700;

function getStepStates(status: OnrampStatus): StepState[] {
  switch (status) {
    case "completed":
      return ["completed", "completed", "completed"];
    case "failed":
      return ["completed", "failed", "pending"];
    default:
      return ["completed", "in_progress", "pending"];
  }
}

interface AnimatedConnectorLineProps {
  isCompleted: boolean;
  delayMs: number;
}

function AnimatedConnectorLine({
  isCompleted,
  delayMs,
}: AnimatedConnectorLineProps) {
  const fillHeight = useSharedValue(0);

  useEffect(() => {
    if (!isCompleted) return;
    const id = setTimeout(() => {
      fillHeight.value = withDelay(
        delayMs,
        withTiming(CONNECTOR_HEIGHT, { duration: LINE_FILL_DURATION })
      );
    }, 100);
    return () => clearTimeout(id);
  }, [isCompleted, delayMs, fillHeight]);

  const animatedFillStyle = useAnimatedStyle(() => ({
    height: fillHeight.value,
  }));

  return (
    <View className="mt-1 h-8 w-0.5 overflow-hidden rounded-sm">
      <View className="bg-default-200 absolute inset-0 w-0.5 rounded-sm" />
      {isCompleted && (
        <Animated.View
          className="bg-accent absolute top-0 left-0 w-0.5 rounded-sm"
          style={animatedFillStyle}
        />
      )}
    </View>
  );
}

interface VerticalStatusProgressProps {
  status: OnrampStatus;
}

function VerticalStatusProgress({ status }: VerticalStatusProgressProps) {
  const states = useMemo(() => getStepStates(status), [status]);

  return (
    <View className="gap-0">
      {STEPS.map((step, index) => {
        const stepState = states[index];
        const isLast = index === STEPS.length - 1;
        const isLineCompleted = stepState === "completed";

        return (
          <View key={step.id} className="flex-row items-start gap-3">
            <View className="w-7 items-center">
              {stepState === "completed" && (
                <VectorIcon name="checkmark-circle" size={24} color="#22c55e" />
              )}
              {stepState === "in_progress" && (
                <Spinner size="sm" className="h-6 w-6" />
              )}
              {stepState === "failed" && (
                <VectorIcon name="close-circle" size={24} color="#ef4444" />
              )}
              {stepState === "pending" && (
                <View className="bg-default-200 h-6 w-6 rounded-full" />
              )}
              {!isLast && (
                <AnimatedConnectorLine
                  isCompleted={isLineCompleted}
                  delayMs={index * STAGGER_DELAY}
                />
              )}
            </View>
            <View className="flex-1 pb-2">
              <Text
                className={
                  stepState === "pending"
                    ? "text-foreground/50 text-sm"
                    : "text-foreground text-sm font-medium"
                }>
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

interface StatusRowProps {
  label: string;
  value: string;
}

function StatusRow({ label, value }: StatusRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-foreground/70 text-sm">{label}</Text>
      <Text className="text-foreground text-sm font-medium">{value}</Text>
    </View>
  );
}

const MOCK_STATUS: {
  status: OnrampStatus;
  sessionId: string;
  asset: string;
  amount: string;
  network: string;
  address: string;
  createdAt: string;
} = {
  status: "completed",
  sessionId: "session_abc123",
  asset: "ETH",
  amount: "0.05",
  network: "Ethereum",
  address: "0x1234...5678",
  createdAt: "2025-02-03 14:30 UTC",
};

function getStatusLabel(status: OnrampStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Pending";
  }
}

export default function CallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const displayData = useMemo(() => {
    const sessionId = (params.session_id as string) ?? MOCK_STATUS.sessionId;
    return {
      ...MOCK_STATUS,
      sessionId,
    };
  }, [params.session_id]);

  return (
    <PageLayout>
      <View className="gap-6 py-10">
        <Card>
          <Card.Header className="mb-4">
            <Card.Title>Onramp Status</Card.Title>
            <Card.Description>
              {getStatusLabel(displayData.status)}
            </Card.Description>
          </Card.Header>
          <Card.Body className="gap-6 px-2">
            <VerticalStatusProgress status={displayData.status} />
            <Divider />
            <StatusRow label="Session ID" value={displayData.sessionId} />
            <StatusRow label="Asset" value={displayData.asset} />
            <StatusRow label="Amount" value={displayData.amount} />
            <StatusRow label="Network" value={displayData.network} />
            <StatusRow label="Address" value={displayData.address} />
            <StatusRow label="Created" value={displayData.createdAt} />
          </Card.Body>
          <Card.Footer className="mt-6">
            <Button variant="primary" onPress={() => router.replace("/(tabs)")}>
              <Button.Label>Back to Home</Button.Label>
            </Button>
          </Card.Footer>
        </Card>
      </View>
    </PageLayout>
  );
}
