import { BgpPattern, BlankTerm, FilterPattern, GroupPattern, IriTerm, OptionalPattern, Pattern, PropertyPath, QuadTerm, Term, Triple, UnionPattern, VariableTerm } from "sparqljs";
import * as DataFactory from "@rdfjs/data-model" ;
import { Literal, NamedNode, Variable } from "@rdfjs/types";

export default class SparqlFactory {

    static buildBgpPattern(triples: Triple[]): BgpPattern {
        return {
            type: "bgp",
            triples: triples,
        };
    }

    static buildGroupPattern(patterns: Pattern[]):GroupPattern {
        return {
          type: "group",
          patterns: patterns
        };
    }

    static buildUnionPattern(patterns: Pattern[]):UnionPattern {
        return {
          type: "union",
          patterns: patterns
        };
    }

    static buildNotExistsPattern(groupPattern: GroupPattern): FilterPattern {
        return {
          type: "filter",
          expression: {
            type: "operation",
            operator: "notexists",
            args: [
                groupPattern
            ],
          },
        };
    }

    static buildOptionalPattern(patterns: Pattern[]): OptionalPattern {
        return {
          type: "optional",
          patterns: patterns,
        };
    }

    static buildFilterTime(
        startDate: Literal,
        endDate: Literal,
        variable: Variable
    ): Pattern {
        
        var filters = new Array ;
        
        if (startDate != null) {
          filters.push( {
            type: "operation",
            operator: ">=",
            args: [
              {
                type: "functioncall",
                function: DataFactory.namedNode(
                  "http://www.w3.org/2001/XMLSchema#dateTime"
                ),
                args : [
                  variable
                ]
              },
              startDate
            ]
          }) ;
        }
        if (endDate != null) {
          filters.push( {
            type: "operation",
            operator: "<=",
            args: [
              {
                type: "functioncall",
                function: DataFactory.namedNode(
                  "http://www.w3.org/2001/XMLSchema#dateTime"
                ),
                "args" : [
                  variable
                ]
              },
              endDate
            ]
          }) ;
        }
      
        if (filters.length == 2 ) {
          return {
            type: "filter",
            expression: {
              type: 'operation',
              operator: "&&",
              args: filters
            }
          } ;
        } else {
          return {
            type: "filter",
            expression: filters[0]
          } ;
        }
      
      }

      static buildTriple(
        subject: IriTerm | BlankTerm | VariableTerm | QuadTerm,
        predicate: IriTerm | VariableTerm | PropertyPath,
        object: Term
      ):Triple {
        return {
            subject: subject,
            predicate: predicate,
            object: object,
        };
      }

      buildRdfTypeTriple(
        subject: IriTerm | BlankTerm | VariableTerm | QuadTerm,
        object: Term
    ): Triple | null {
        return SparqlFactory.buildTriple(
            subject,
            DataFactory.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            object
        );
      }
}

