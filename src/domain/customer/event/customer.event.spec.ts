import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerChangedAddressEvent from "./customer-changed-address.event";
import CustomerCreatedEvent from "./customer-created.event";
import ConsoleLogOneWhenCustomerIsCreatedHandler from "./handler/console-log-one-when-customer-is-created.handler";
import ConsoleLogTwoWhenCustomerIsCreatedHandler from "./handler/console-log-two-when-customer-is-created.handler";
import ConsoleLogWhenCustomerAddressIsChangedHandler from "./handler/console-log-when-customer-address-is-changed.handler";

describe("Customer domain events tests", () => {
  it("should notify all event handlers when a customer is created", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandlerOne = new ConsoleLogOneWhenCustomerIsCreatedHandler();
    const spyEventHandlerOne = jest.spyOn(eventHandlerOne, "handle");

    const eventHandlerTwo = new ConsoleLogTwoWhenCustomerIsCreatedHandler();
    const spyEventHandlerTwo = jest.spyOn(eventHandlerTwo, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerOne);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandlerTwo);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
      description: "Customer 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandlerOne).toHaveBeenCalled();
    expect(spyEventHandlerTwo).toHaveBeenCalled();
  });

  it("should notify a event handler when customer has changed address", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLogWhenCustomerAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;

    customer.changeAddress(new Address("Street 2", 2, "Zipcode 2", "City 2"));

    const customerAddressChangedEvent = new CustomerChangedAddressEvent(
      customer
    );

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
