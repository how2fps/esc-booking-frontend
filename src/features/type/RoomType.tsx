export interface Room {
        key: string;
        roomDescription: string;
        roomNormalizedDescription: string;
        type: string;
        free_cancellation: boolean;
        long_description: string;
        roomAdditionalInfo: {
            breakfastInfo?: string;
            displayFields: {
                special_check_in_instructions?: string;
                check_in_instructions?: string;
                know_before_you_go?: string;
                fees_optional?: string | null;
                fees_mandatory?: string | null;
                kaligo_service_fee: number;
                hotel_fees: number;
                surcharges: Array<{
                    type: string;
                    amount: number;
                }>[];
            };
        };
        description: string;
        rooms_available: number;
        images: Array<{
            url: string;
            high_resolution_url: string;
            hero_image: boolean;
        }>;
        amenities: string[];
        price_type: string;
        max_cash_payment: number;
        coverted_max_cash_payment: number; // API has typo
        points: number;
        bonuses: number;
        bonus_programs: string[];
        bonus_tiers: string[];
        lowest_price: number;
        price: number;
        converted_price: number;
        lowest_converted_price: number;
        chargeableRate: number;
        market_rates: Array<{
            supplier: string;
            rate: number;
        }>;
        base_rate: number;
        base_rate_in_currency: number;
        included_taxes_and_fees_total: number;
        included_taxes_and_fees_total_in_currency: number;
        excluded_taxes_and_fees_currency: string;
        excluded_taxes_and_fees_total: number;
        excluded_taxes_and_fees_total_in_currency: number;
        included_taxes_and_fees: Array<{
            id: string;
            amount: number;
            currency: string;
        }>;
        included_taxes_and_fees_in_currency: Array<{
            id: string;
            amount: number;
            currency: string;
        }>;
}

