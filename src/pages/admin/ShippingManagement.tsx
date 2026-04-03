import { useState, useEffect } from "react";
import { api } from "@/db/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Package } from "lucide-react";
import type { ShippingConfig } from "@/types/types";
import { getRegionDisplayName, formatWeight } from "@/lib/shipping";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ShippingManagement() {
  const [configs, setConfigs] = useState<ShippingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadShippingConfig();
  }, []);

  const loadShippingConfig = async () => {
    try {
      setLoading(true);
      const data = await api.getShippingConfig();
      setConfigs(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load shipping configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: { base_cost?: number; additional_cost_per_500g?: number }) => {
    try {
      setSaving(id);
      await api.updateShippingConfig(id, updates);
      toast({
        title: "Success",
        description: "Shipping configuration updated successfully",
      });
      await loadShippingConfig();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update shipping configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleInputChange = (id: string, field: string, value: string) => {
    setConfigs((prev) =>
      prev.map((config) =>
        config.id === id
          ? { ...config, [field]: Number.parseFloat(value) || 0 }
          : config
      )
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const tamilNaduConfigs = configs.filter((c) => c.region === "tamil_nadu");
  const otherStatesConfigs = configs.filter((c) => c.region === "other_states");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Shipping Management</h1>
          <p className="text-muted-foreground">
            Configure shipping rates based on weight and region
          </p>
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Tamil Nadu Shipping Rates
            </CardTitle>
            <CardDescription>
              Configure shipping costs for deliveries within Tamil Nadu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {tamilNaduConfigs.map((config) => (
              <div key={config.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {formatWeight(config.weight_from_grams)} -{" "}
                      {config.weight_to_grams ? formatWeight(config.weight_to_grams) : "Above"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Weight range for this rate
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`base-${config.id}`}>Base Cost (₹)</Label>
                    <Input
                      id={`base-${config.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={config.base_cost}
                      onChange={(e) =>
                        handleInputChange(config.id, "base_cost", e.target.value)
                      }
                      disabled={saving === config.id}
                    />
                  </div>

                  {config.additional_cost_per_500g !== null && (
                    <div className="space-y-2">
                      <Label htmlFor={`additional-${config.id}`}>
                        Additional Cost per 500g (₹)
                      </Label>
                      <Input
                        id={`additional-${config.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.additional_cost_per_500g}
                        onChange={(e) =>
                          handleInputChange(
                            config.id,
                            "additional_cost_per_500g",
                            e.target.value
                          )
                        }
                        disabled={saving === config.id}
                      />
                      <p className="text-xs text-muted-foreground">
                        Applied for weight above 1kg
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() =>
                    handleUpdate(config.id, {
                      base_cost: config.base_cost,
                      additional_cost_per_500g: config.additional_cost_per_500g || undefined,
                    })
                  }
                  disabled={saving === config.id}
                  className="w-full"
                >
                  {saving === config.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Other States Shipping Rates
            </CardTitle>
            <CardDescription>
              Configure shipping costs for deliveries to other Indian states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {otherStatesConfigs.map((config) => (
              <div key={config.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {formatWeight(config.weight_from_grams)} -{" "}
                      {config.weight_to_grams ? formatWeight(config.weight_to_grams) : "Above"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Weight range for this rate
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`base-${config.id}`}>Base Cost (₹)</Label>
                    <Input
                      id={`base-${config.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={config.base_cost}
                      onChange={(e) =>
                        handleInputChange(config.id, "base_cost", e.target.value)
                      }
                      disabled={saving === config.id}
                    />
                  </div>

                  {config.additional_cost_per_500g !== null && (
                    <div className="space-y-2">
                      <Label htmlFor={`additional-${config.id}`}>
                        Additional Cost per 500g (₹)
                      </Label>
                      <Input
                        id={`additional-${config.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.additional_cost_per_500g}
                        onChange={(e) =>
                          handleInputChange(
                            config.id,
                            "additional_cost_per_500g",
                            e.target.value
                          )
                        }
                        disabled={saving === config.id}
                      />
                      <p className="text-xs text-muted-foreground">
                        Applied for weight above 1kg
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() =>
                    handleUpdate(config.id, {
                      base_cost: config.base_cost,
                      additional_cost_per_500g: config.additional_cost_per_500g || undefined,
                    })
                  }
                  disabled={saving === config.id}
                  className="w-full"
                >
                  {saving === config.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Rate Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Tamil Nadu Rates</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 0-500g: ₹{tamilNaduConfigs[0]?.base_cost || 70}</li>
                <li>• 501-1000g: ₹{tamilNaduConfigs[1]?.base_cost || 100}</li>
                <li>
                  • Above 1kg: ₹{tamilNaduConfigs[2]?.base_cost || 100} + ₹
                  {tamilNaduConfigs[2]?.additional_cost_per_500g || 40} per 500g
                </li>
              </ul>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Other States Rates</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 0-500g: ₹{otherStatesConfigs[0]?.base_cost || 90}</li>
                <li>• 501-1000g: ₹{otherStatesConfigs[1]?.base_cost || 130}</li>
                <li>
                  • Above 1kg: ₹{otherStatesConfigs[2]?.base_cost || 130} + ₹
                  {otherStatesConfigs[2]?.additional_cost_per_500g || 50} per 500g
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              How Shipping Calculation Works
            </h3>
            <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
              <li>• Shipping cost is calculated based on total order weight and delivery state</li>
              <li>• For orders above 1kg, additional charges apply per 500g increment</li>
              <li>• Shipping rates are automatically applied at checkout</li>
              <li>• Changes to rates apply immediately to new orders</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}
