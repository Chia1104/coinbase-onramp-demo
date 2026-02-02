import { useForm, Controller } from "react-hook-form";
import { Linking } from "react-native";
import { View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  TextField,
  Tabs,
  Checkbox,
  FormField,
  Surface,
  ErrorView,
} from "heroui-native";
import * as z from "zod";

import { PageLayout } from "@/components/page-layout";
import { useGetOnrampUrl } from "@/lib/coinbase/hooks/use-get-onramp-url";

const formSchema = z.object({
  address: z.string().min(1),
  network: z.enum(["ethereum"]),
  assets: z
    .array(z.string(), { message: "At least one asset is required" })
    .min(1, { message: "At least one asset is required" }),
});

const SupportedAssets = [
  {
    name: "USDC",
    value: "USDC",
  },
  {
    name: "USDT",
    value: "USDT",
  },
];

interface CheckboxFieldProps {
  isSelected: boolean;
  onSelectedChange: (value: boolean) => void;
  title: string;
  description?: string;
}

const CheckboxField = ({
  isSelected,
  onSelectedChange,
  title,
  description,
}: CheckboxFieldProps) => {
  return (
    <FormField isSelected={isSelected} onSelectedChange={onSelectedChange}>
      <FormField.Indicator>
        <Checkbox className="mt-0.5" variant="secondary" />
      </FormField.Indicator>
      <View className="flex-1">
        <FormField.Label className="text-lg">{title}</FormField.Label>
        {description && (
          <FormField.Description className="text-base">
            {description}
          </FormField.Description>
        )}
      </View>
    </FormField>
  );
};

export default function HomeScreen() {
  const { mutateAsync: getOnrampUrl } = useGetOnrampUrl();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      network: "ethereum",
      assets: [],
    },
  });

  const handleGetOnrampUrl = form.handleSubmit(async (data) => {
    const url = await getOnrampUrl({
      addresses: [
        {
          address: data.address,
          blockchains: [data.network],
        },
      ],
      assets: data.assets,
    });
    console.log("url", url);
    await Linking.openURL(url);
  });

  return (
    <PageLayout>
      <View className="gap-6 py-10">
        <Card>
          <Card.Header>
            <Card.Title>Coinbase Onramp</Card.Title>
          </Card.Header>
          <Card.Body className="gap-4">
            <Card.Description>This is a test</Card.Description>
            <Controller
              name="network"
              control={form.control}
              render={({ field }) => (
                <Tabs value={field.value} onValueChange={field.onChange}>
                  <Tabs.List>
                    <Tabs.Indicator />
                    <Tabs.Trigger value="ethereum">
                      <Tabs.Label>Ethereum</Tabs.Label>
                    </Tabs.Trigger>
                    {/* <Tabs.Trigger value="tron">
                      <Tabs.Label>Tron</Tabs.Label>
                    </Tabs.Trigger> */}
                  </Tabs.List>
                </Tabs>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField isRequired isInvalid={!!fieldState.error}>
                  <TextField.Label>Address</TextField.Label>
                  <TextField.Input
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                  <TextField.ErrorMessage>
                    Please enter a valid address
                  </TextField.ErrorMessage>
                </TextField>
              )}
            />
            <Surface className="w-full gap-2" variant="transparent">
              <Controller
                control={form.control}
                name="assets"
                render={({ field, fieldState }) => (
                  <>
                    {SupportedAssets.map((asset) => (
                      <CheckboxField
                        key={asset.value}
                        isSelected={field.value.includes(asset.value)}
                        onSelectedChange={(value) => {
                          if (value) {
                            field.onChange([...field.value, asset.value]);
                          } else {
                            field.onChange(
                              field.value.filter((v) => v !== asset.value)
                            );
                          }
                        }}
                        title={asset.name}
                      />
                    ))}
                    <ErrorView isInvalid={!!fieldState.error}>
                      {fieldState.error?.message}
                    </ErrorView>
                  </>
                )}
              />
            </Surface>
          </Card.Body>
          <Card.Footer className="mt-6">
            <Button onPress={handleGetOnrampUrl}>
              <Button.Label>Open Onramp Widget</Button.Label>
            </Button>
          </Card.Footer>
        </Card>
      </View>
    </PageLayout>
  );
}
