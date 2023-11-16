import { createClient } from "@supabase/supabase-js";
import { stripe } from "./stripe";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)

const updateOrRetrieveCustomer = async ({
  email,
  uuid,
  name,
}: {
  email: string,
  uuid: string,
  name: string,
}) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('user_id', uuid).
    single()

  if (error || !data.stripe_customer_id) {
    const customerData: { metadata: { supabaseUUID: string }; email?: string, name?: string } = {
      metadata: {
        supabaseUUID: uuid,
      },
    }

    if (email) customerData.email = email
    if (name) customerData.name = email

    const customer = await stripe.customers.create(customerData);

    const { error: supabaseError } = await supabaseAdmin.from('profiles').update({ stripe_customer_id: customer.id }).eq('user_id', uuid)

    if (supabaseError) throw supabaseError;

    console.log('New stripe customer created for ', uuid);

    return customer.id
  }

  return data.stripe_customer_id
}

const upsertTransaction = async ({
  id,
  user_id,
  amount_total,
  customer_id,
  payment_intent,
  customer_email,
  quantity,
  payment_status,
}: {
  id: string,
  user_id: string,
  amount_total: number,
  customer_id: string,
  payment_intent: string,
  customer_email: string,
  quantity: string,
  payment_status: string,
}) => {
  const { data, error } = await supabaseAdmin.from('transactions').insert({
    id,
    user_id,
    amount_total,
    customer_id,
    payment_intent,
    customer_email,
    quantity,
    payment_status,
  })

  if (error) {
    console.log('Error for transaction ', id);
    return
  }

  const response = await supabaseAdmin.rpc('increment_token', { id: user_id, quantity: quantity })

  console.log('Transaction saved id: ', id);

}

export { updateOrRetrieveCustomer, upsertTransaction }