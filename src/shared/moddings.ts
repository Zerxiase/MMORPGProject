import { Modding } from "@flamework/core";

// Property Decorators
export const FieldDecorator = Modding.createMetaDecorator<[string]>("Property");
export const FieldDecorator_ = Modding.createDecorator<[string]>("Property", (descriptor, [name]) => {
	print("Decorated field", descriptor.isStatic, tostring(descriptor.object) + "." + descriptor.property);
	print("Passed in name:", name);
});

// Method Decorators
export const MethodDecorator = Modding.createMetaDecorator<[string]>("Method");
export const MethodDecorator_ = Modding.createDecorator<[string]>("Method", (descriptor, [name]) => {
	print("Decorated method", descriptor.isStatic, tostring(descriptor.object) + "." + descriptor.property + "()");
	print("Passed in name:", name);
});

// Class Decorators
export const NameDecorator = Modding.createMetaDecorator<[string]>("Class");
export const NameDecorator_ = Modding.createDecorator<[string]>("Class", (descriptor, [name]) => {
	print("Decorated object", descriptor.object);
	print("Passed in name:", name);
});

@NameDecorator("Peter")
class A {
	@FieldDecorator("John")
	public abc = 1;

	@FieldDecorator("Andrew")
	@MethodDecorator("Andrew")
	public method() {}
}
