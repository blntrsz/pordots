import { StandardSchemaV1 } from "@standard-schema/spec";

export function Model<TInput extends StandardSchemaV1>(schema: TInput) {
  return class {
    static schema = schema;
    props: StandardSchemaV1.InferOutput<TInput>;

    constructor(props: StandardSchemaV1.InferOutput<TInput>) {
      this.props = props;
    }
  };
}
